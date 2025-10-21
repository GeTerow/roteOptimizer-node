from PyPDF2 import PdfReader
import re, csv
from datetime import datetime
from collections import Counter

PDF_PATH = "Romaneio_Fluig_Resumo_205698_16_10_2025.pdf"
OUT_CSV = "clientes_cidades_romaneio.csv"
OUT_ADDR = "enderecos_detectados.csv"

# 1) extrai texto
reader = PdfReader(PDF_PATH)
text = "\n".join(page.extract_text() or "" for page in reader.pages)

# normaliza artefatos comuns (LTDA/ME/EIRELI às vezes saem "separados")
text = re.sub(r"\bL\s+TDA\b", "LTDA", text)
text = re.sub(r"\bE\s*I\s*R\s*E\s*L\s*I\b", "EIRELI", text)
text = re.sub(r"\bM\s*E\b", "ME", text)

# 2) acha cada linha de pedido: prefixo + pedido(6d) + dd/mm/aaaa + R\d + peso (com até 2 decimais)
row_re = re.compile(
    r"^(?P<prefix>.+?)(?P<pedido>\d{6})(?P<emissao>\d{2}/\d{2}/\d{4})R(?P<reg>\d)(?P<peso>\d+(?:[.,]\d{1,2})?)",
    re.MULTILINE
)
matches = list(row_re.finditer(text))

# 3) separa nome x cidade (toma o n-grama final mais frequente como cidade)
def toks(s): return s.strip().split()
def last_ngrams(ts, k=3):
    out=[]; 
    for n in range(1, k+1):
        if len(ts)>=n: out.append(tuple(ts[-n:]))
    return out

COMPANY_SUFFIX = {"LTDA","ME","EIRELI","EPP","S/A","SA","EI","MEI"}
def city_like(ng):
    for t in ng:
        if any(ch.isdigit() for ch in t): return False
        if any(ch in "./" for ch in t): return False
        if t.upper() in COMPANY_SUFFIX: return False
    return True

freq = Counter()
rows_tmp = []
for m in matches:
    prefix = m.group("prefix").strip()
    rows_tmp.append(m)
    for ng in last_ngrams(toks(prefix), 3):
        if city_like(ng): freq[ng]+=1

def split_name_city(prefix):
    ts = toks(prefix)
    cands = [ng for ng in last_ngrams(ts,3) if city_like(ng)]
    best = max(cands, key=lambda ng:(freq[ng], len(ng))) if cands else (ts[-1],)
    city = " ".join(best)
    name = " ".join(ts[:-len(best)]) if len(best)<len(ts) else " ".join(ts)
    return name.strip(), city.strip()

# 4) monta CSV principal
out = []
for m in matches:
    name, city = split_name_city(m.group("prefix"))
    emissao_iso = datetime.strptime(m.group("emissao"), "%d/%m/%Y").date().isoformat()
    out.append({
        "cliente": name,
        "cidade": city,
        "pedido": m.group("pedido"),
        "emissao": emissao_iso,
        "regiao": "R"+m.group("reg"),
        "peso_kg": m.group("peso").replace(",", ".")
    })

with open(OUT_CSV, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=list(out[0].keys()))
    w.writeheader(); w.writerows(out)

# 5) tenta extrair endereços (apenas remetente nesse modelo)
addr = re.findall(r"(Rua\s+[^C]+CEP:\s*\d{5}-\d{3})", text, flags=re.IGNORECASE)
addr = sorted(set(addr))
with open(OUT_ADDR, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["tipo","endereco"])
    for a in addr: w.writerow(["remetente", a])

print(f"Linhas extraídas: {len(out)}")
print(f"Clientes + cidades -> {OUT_CSV}")
print(f"Endereços detectados -> {OUT_ADDR} (remetente)")
