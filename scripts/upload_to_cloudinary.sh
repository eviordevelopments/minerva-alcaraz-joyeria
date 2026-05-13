#!/bin/bash
# ============================================================
# Minerva Alcaraz — Cloudinary Bulk Upload
# Comprime archivos >9MB con sips (macOS nativo)
# Genera public_ids limpios (sin espacios ni caracteres especiales)
# ============================================================

CLOUD_NAME="dlsc3ova5"
API_KEY="577425751737543"
API_SECRET="3Zs4__61gSXP-gNqRJqiK4UZ5VY"
REPO_ROOT="/Users/emilianocastillo/minerva-alcaraz-joyeria"
RESULTS_FILE="$REPO_ROOT/scripts/upload_results.txt"
TEMP_DIR="$REPO_ROOT/.upload_temp"
mkdir -p "$TEMP_DIR"
echo "" > "$RESULTS_FILE"

TOTAL=0
SUCCESS=0
FAILED=0

# ─── Comprimir si > 9MB ────────────────────────────────────
compress_if_needed() {
  local src="$1"
  local dst="$2"
  local size
  size=$(stat -f%z "$src" 2>/dev/null || echo 0)
  local limit=$((9 * 1024 * 1024))
  if [ "$size" -gt "$limit" ]; then
    local mb=$(echo "scale=1; $size/1024/1024" | bc)
    echo "   ⚙️  ${mb}MB → comprimiendo con sips..."
    sips -s format jpeg -s formatOptions 75 -Z 2400 "$src" --out "$dst" 2>/dev/null
    local new_size
    new_size=$(stat -f%z "$dst" 2>/dev/null || echo 0)
    local new_mb=$(echo "scale=1; $new_size/1024/1024" | bc)
    echo "   ✅ Comprimido a ${new_mb}MB"
  else
    cp "$src" "$dst"
  fi
}

# ─── Upload a Cloudinary ────────────────────────────────────
upload_one() {
  local local_path="$1"   # ruta absoluta al archivo
  local public_id="$2"    # ej: minerva_joyeria/products/eterea/Minerva2-2

  TOTAL=$((TOTAL + 1))

  if [ ! -f "$local_path" ]; then
    echo "   ⚠️  Archivo no encontrado: $local_path"
    FAILED=$((FAILED + 1))
    return
  fi

  local ext="${local_path##*.}"
  local tmp="$TEMP_DIR/up_${TOTAL}.${ext}"
  compress_if_needed "$local_path" "$tmp"

  local timestamp
  timestamp=$(date +%s)

  # Firma: public_id + timestamp + secret
  local sig_str="public_id=${public_id}&timestamp=${timestamp}${API_SECRET}"
  local signature
  signature=$(echo -n "$sig_str" | openssl dgst -sha1 | sed 's/.* //')

  local response
  response=$(curl -s --max-time 120 -X POST \
    -F "file=@${tmp}" \
    -F "api_key=${API_KEY}" \
    -F "timestamp=${timestamp}" \
    -F "public_id=${public_id}" \
    -F "signature=${signature}" \
    "https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload")

  rm -f "$tmp"

  local secure_url
  secure_url=$(echo "$response" | python3 -c "import sys,json; r=sys.stdin.read().strip(); d=json.loads(r) if r.startswith('{') else {}; print(d.get('secure_url',''))" 2>/dev/null)
  local err
  err=$(echo "$response" | python3 -c "import sys,json; r=sys.stdin.read().strip(); d=json.loads(r) if r.startswith('{') else {}; print(d.get('error',{}).get('message', r))" 2>/dev/null)

  if [ -n "$secure_url" ]; then
    echo "   ✅ $secure_url"
    echo "$public_id|$secure_url" >> "$RESULTS_FILE"
    SUCCESS=$((SUCCESS + 1))
  else
    echo "   ❌ Error: $err"
    echo "FAILED|$public_id|$err" >> "$RESULTS_FILE"
    FAILED=$((FAILED + 1))
  fi
}

R="$REPO_ROOT"

echo "╔══════════════════════════════════════════════════════╗"
echo "║  Minerva Alcaraz — Cloudinary Upload                ║"
echo "║  Cloud: ${CLOUD_NAME}  API Key: ${API_KEY:0:8}...    ║"
echo "╚══════════════════════════════════════════════════════╝"

# ═══════════════════════════════════════════════════════════
# ETÉREA  (Minerva2-*.JPG sin espacio — formato correcto)
# ═══════════════════════════════════════════════════════════
echo ""
echo "▶  ETÉREA"

upload_one "$R/ETÉREA/Minerva2-2.JPG"   "minerva_joyeria/products/eterea/Minerva2-2"
upload_one "$R/ETÉREA/Minerva2-3.JPG"   "minerva_joyeria/products/eterea/Minerva2-3"
upload_one "$R/ETÉREA/Minerva2-4.JPG"   "minerva_joyeria/products/eterea/Minerva2-4"
upload_one "$R/ETÉREA/Minerva2-5.JPG"   "minerva_joyeria/products/eterea/Minerva2-5"
upload_one "$R/ETÉREA/Minerva2-6.JPG"   "minerva_joyeria/products/eterea/Minerva2-6"
upload_one "$R/ETÉREA/Minerva2-7.JPG"   "minerva_joyeria/products/eterea/Minerva2-7"
upload_one "$R/ETÉREA/Minerva2-8.JPG"   "minerva_joyeria/products/eterea/Minerva2-8"
upload_one "$R/ETÉREA/Minerva2-9.JPG"   "minerva_joyeria/products/eterea/Minerva2-9"
upload_one "$R/ETÉREA/Minerva2-10.JPG"  "minerva_joyeria/products/eterea/Minerva2-10"
upload_one "$R/ETÉREA/Minerva2-11.JPG"  "minerva_joyeria/products/eterea/Minerva2-11"
upload_one "$R/ETÉREA/Minerva2.JPG"     "minerva_joyeria/products/eterea/Minerva2"

# Etérea con espacio → public_id limpio con guión
upload_one "$R/ETÉREA/Minerva 2-12.jpg" "minerva_joyeria/products/eterea/Minerva2-12"
upload_one "$R/ETÉREA/Minerva 2-13.jpg" "minerva_joyeria/products/eterea/Minerva2-13"
upload_one "$R/ETÉREA/Minerva 2-14.jpg" "minerva_joyeria/products/eterea/Minerva2-14"
upload_one "$R/ETÉREA/Minerva 2-15.jpg" "minerva_joyeria/products/eterea/Minerva2-15"
upload_one "$R/ETÉREA/Minerva 2-16.jpg" "minerva_joyeria/products/eterea/Minerva2-16"
upload_one "$R/ETÉREA/Minerva 2-17.jpg" "minerva_joyeria/products/eterea/Minerva2-17"
upload_one "$R/ETÉREA/Minerva 2-18.jpg" "minerva_joyeria/products/eterea/Minerva2-18"
upload_one "$R/ETÉREA/Minerva 2-19.jpg" "minerva_joyeria/products/eterea/Minerva2-19"
upload_one "$R/ETÉREA/Minerva 2-20.jpg" "minerva_joyeria/products/eterea/Minerva2-20"
upload_one "$R/ETÉREA/Minerva 2-21.jpg" "minerva_joyeria/products/eterea/Minerva2-21"
upload_one "$R/ETÉREA/Minerva 2-22.jpg" "minerva_joyeria/products/eterea/Minerva2-22"
upload_one "$R/ETÉREA/Minerva 2-24.jpg" "minerva_joyeria/products/eterea/Minerva2-24"
upload_one "$R/ETÉREA/Minerva 2-25.jpg" "minerva_joyeria/products/eterea/Minerva2-25"
upload_one "$R/ETÉREA/Minerva 2-26.jpg" "minerva_joyeria/products/eterea/Minerva2-26"
upload_one "$R/ETÉREA/Minerva 2-27.jpg" "minerva_joyeria/products/eterea/Minerva2-27"
upload_one "$R/ETÉREA/Minerva 2-28.jpg" "minerva_joyeria/products/eterea/Minerva2-28"
upload_one "$R/ETÉREA/Minerva 2-30.jpg" "minerva_joyeria/products/eterea/Minerva2-30"
upload_one "$R/ETÉREA/Minerva 2-31.jpg" "minerva_joyeria/products/eterea/Minerva2-31"
upload_one "$R/ETÉREA/Minerva 2-32.jpg" "minerva_joyeria/products/eterea/Minerva2-32"
upload_one "$R/ETÉREA/Minerva 2-33.jpg" "minerva_joyeria/products/eterea/Minerva2-33"
upload_one "$R/ETÉREA/Minerva 2-34.jpg" "minerva_joyeria/products/eterea/Minerva2-34"
upload_one "$R/ETÉREA/Minerva 2-35.jpg" "minerva_joyeria/products/eterea/Minerva2-35"
upload_one "$R/ETÉREA/Minerva 2-36.jpg" "minerva_joyeria/products/eterea/Minerva2-36"
upload_one "$R/ETÉREA/Minerva 2-37.jpg" "minerva_joyeria/products/eterea/Minerva2-37"
upload_one "$R/ETÉREA/Minerva 2-38.jpg" "minerva_joyeria/products/eterea/Minerva2-38"
upload_one "$R/ETÉREA/Minerva 2-39.jpg" "minerva_joyeria/products/eterea/Minerva2-39"
upload_one "$R/ETÉREA/Minerva 2-40.jpg" "minerva_joyeria/products/eterea/Minerva2-40"
upload_one "$R/ETÉREA/Minerva 2-41.jpg" "minerva_joyeria/products/eterea/Minerva2-41"
upload_one "$R/ETÉREA/Minerva 2-42.jpg" "minerva_joyeria/products/eterea/Minerva2-42"
upload_one "$R/ETÉREA/Minerva 2-44.jpg" "minerva_joyeria/products/eterea/Minerva2-44"

# ═══════════════════════════════════════════════════════════
# INDIVIDUALES 2
# ═══════════════════════════════════════════════════════════
echo ""
echo "▶  INDIVIDUALES"

upload_one "$R/INDIVIDUALES 2/MINE-30.JPG"              "minerva_joyeria/products/individuales/MINE-30"
upload_one "$R/INDIVIDUALES 2/MINE-32.JPG"              "minerva_joyeria/products/individuales/MINE-32"
upload_one "$R/INDIVIDUALES 2/MINE-36.JPG"              "minerva_joyeria/products/individuales/MINE-36"
upload_one "$R/INDIVIDUALES 2/MINE-41.JPG"              "minerva_joyeria/products/individuales/MINE-41"
upload_one "$R/INDIVIDUALES 2/MINE-51.JPG"              "minerva_joyeria/products/individuales/MINE-51"
upload_one "$R/INDIVIDUALES 2/MINE-52.jpg"              "minerva_joyeria/products/individuales/MINE-52"
upload_one "$R/INDIVIDUALES 2/Minerva2-25.jpg"          "minerva_joyeria/products/individuales/Minerva2-25"
upload_one "$R/INDIVIDUALES 2/Minerva2-26 (1).jpg"      "minerva_joyeria/products/individuales/Minerva2-26"
upload_one "$R/INDIVIDUALES 2/Minerva2-41.jpg"          "minerva_joyeria/products/individuales/Minerva2-41"
upload_one "$R/INDIVIDUALES 2/Minerva 2-43.jpg"         "minerva_joyeria/products/individuales/Minerva2-43"
upload_one "$R/INDIVIDUALES 2/Minerva 2-45.jpg"         "minerva_joyeria/products/individuales/Minerva2-45"
upload_one "$R/INDIVIDUALES 2/Minerva 2-49.jpg"         "minerva_joyeria/products/individuales/Minerva2-49"
upload_one "$R/INDIVIDUALES 2/SMA_MINERVA-81.JPG"       "minerva_joyeria/products/individuales/SMA_MINERVA-81"
upload_one "$R/INDIVIDUALES 2/SMA_MINERVA-83.JPG"       "minerva_joyeria/products/individuales/SMA_MINERVA-83"
upload_one "$R/INDIVIDUALES 2/Minerva_Joyeria_1_-5.JPG" "minerva_joyeria/products/individuales/Minerva_Joyeria_1_-5"
upload_one "$R/INDIVIDUALES 2/Minerva_Joyeria_1_-7.JPG" "minerva_joyeria/products/individuales/Minerva_Joyeria_1_-7"
upload_one "$R/INDIVIDUALES 2/Minerva_Joyeria_1_-8.JPG" "minerva_joyeria/products/individuales/Minerva_Joyeria_1_-8"
upload_one "$R/INDIVIDUALES 2/mine-24.JPG"              "minerva_joyeria/products/individuales/mine-24"
upload_one "$R/INDIVIDUALES 2/mine-25.JPG"              "minerva_joyeria/products/individuales/mine-25"

# ═══════════════════════════════════════════════════════════
# ANILLOS DE PIEDRAS
# ═══════════════════════════════════════════════════════════
echo ""
echo "▶  ANILLOS DE PIEDRAS"

upload_one "$R/ANILLOS DE PIEDRAS/SMA_MINERVA-4.JPG"   "minerva_joyeria/products/anillos-piedras/SMA_MINERVA-4"
upload_one "$R/ANILLOS DE PIEDRAS/SMA_MINERVA-5.JPG"   "minerva_joyeria/products/anillos-piedras/SMA_MINERVA-5"
upload_one "$R/ANILLOS DE PIEDRAS/SMA_MINERVA-6.JPG"   "minerva_joyeria/products/anillos-piedras/SMA_MINERVA-6"
upload_one "$R/ANILLOS DE PIEDRAS/SMA_MINERVA-7.JPG"   "minerva_joyeria/products/anillos-piedras/SMA_MINERVA-7"

# ═══════════════════════════════════════════════════════════
# ECOS DE LA TIERRA  (archivos ~20MB → compresión automática)
# ═══════════════════════════════════════════════════════════
echo ""
echo "▶  ECOS DE LA TIERRA  (compresión automática para archivos >9MB)"

upload_one "$R/ECOS DE LA TIERRA/ANILLO 1.jpg"       "minerva_joyeria/products/ecos-tierra/ANILLO-1"
upload_one "$R/ECOS DE LA TIERRA/ANILLO 2.jpg"       "minerva_joyeria/products/ecos-tierra/ANILLO-2"
upload_one "$R/ECOS DE LA TIERRA/ANILLO 3.jpg"       "minerva_joyeria/products/ecos-tierra/ANILLO-3"
upload_one "$R/ECOS DE LA TIERRA/ANILLO 4.jpg"       "minerva_joyeria/products/ecos-tierra/ANILLO-4"
upload_one "$R/ECOS DE LA TIERRA/ANILLO 5.jpg"       "minerva_joyeria/products/ecos-tierra/ANILLO-5"
upload_one "$R/ECOS DE LA TIERRA/ANILLO 6.jpg"       "minerva_joyeria/products/ecos-tierra/ANILLO-6"
upload_one "$R/ECOS DE LA TIERRA/ANILLO 7.jpg"       "minerva_joyeria/products/ecos-tierra/ANILLO-7"
upload_one "$R/ECOS DE LA TIERRA/ANILLO 8.jpg"       "minerva_joyeria/products/ecos-tierra/ANILLO-8"
upload_one "$R/ECOS DE LA TIERRA/ANILLO 9.jpg"       "minerva_joyeria/products/ecos-tierra/ANILLO-9"
upload_one "$R/ECOS DE LA TIERRA/ANILLO 10.jpg"      "minerva_joyeria/products/ecos-tierra/ANILLO-10"
upload_one "$R/ECOS DE LA TIERRA/ANILLO 11.jpg"      "minerva_joyeria/products/ecos-tierra/ANILLO-11"
upload_one "$R/ECOS DE LA TIERRA/DSCF4196 (1).JPG"   "minerva_joyeria/products/ecos-tierra/DSCF4196"
upload_one "$R/ECOS DE LA TIERRA/DSCF4197.JPG"       "minerva_joyeria/products/ecos-tierra/DSCF4197"
upload_one "$R/ECOS DE LA TIERRA/DSCF4204.JPG"       "minerva_joyeria/products/ecos-tierra/DSCF4204"
upload_one "$R/ECOS DE LA TIERRA/DSCF4299.JPG"       "minerva_joyeria/products/ecos-tierra/DSCF4299"
upload_one "$R/ECOS DE LA TIERRA/DSCF4300.JPG"       "minerva_joyeria/products/ecos-tierra/DSCF4300"
upload_one "$R/ECOS DE LA TIERRA/DSCF4306 (1).JPG"   "minerva_joyeria/products/ecos-tierra/DSCF4306"
upload_one "$R/ECOS DE LA TIERRA/DSCF4307.JPG"       "minerva_joyeria/products/ecos-tierra/DSCF4307"
upload_one "$R/ECOS DE LA TIERRA/DSCF4309 (2).JPG"   "minerva_joyeria/products/ecos-tierra/DSCF4309"
upload_one "$R/ECOS DE LA TIERRA/DSCF4317.JPG"       "minerva_joyeria/products/ecos-tierra/DSCF4317"
upload_one "$R/ECOS DE LA TIERRA/DSCF4318.JPG"       "minerva_joyeria/products/ecos-tierra/DSCF4318"
upload_one "$R/ECOS DE LA TIERRA/DSCF4320 (1).JPG"   "minerva_joyeria/products/ecos-tierra/DSCF4320"

# ═══════════════════════════════════════════════════════════
# RESUMEN
# ═══════════════════════════════════════════════════════════
rm -rf "$TEMP_DIR"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  RESUMEN FINAL                                       ║"
printf "║  Total: %-4s  ✅ OK: %-4s  ❌ Error: %-4s          ║\n" "$TOTAL" "$SUCCESS" "$FAILED"
echo "║  Resultados: scripts/upload_results.txt             ║"
echo "╚══════════════════════════════════════════════════════╝"
