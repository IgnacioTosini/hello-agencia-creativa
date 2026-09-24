# Estrategia de backups

## PostgreSQL

- Ejecutar `npm run backup:postgres` diariamente.
- Guardar una copia fuera del servidor: almacenamiento cifrado o bucket privado.
- Retención sugerida: 7 copias diarias, 4 semanales y 6 mensuales.
- Probar una restauración al menos una vez por mes en una base temporal.

Restauración de prueba:

```powershell
Get-Content backups/postgres/archivo.sql |
  docker compose exec -T postgres-db sh -c `
    'psql --username="$POSTGRES_USER" --dbname="$POSTGRES_DB"'
```

## Cloudinary

- Ejecutar `npm run backup:cloudinary` semanalmente.
- El script descarga solamente la carpeta definida en `CLOUDINARY_UPLOAD_FOLDER` y genera un `manifest.json` con los `public_id` originales.
- Copiar `backups/cloudinary` a almacenamiento privado externo.
- Conservar al menos cuatro copias semanales.

## Controles

- Los backups locales están excluidos de Git.
- Una tarea programada debe revisar el código de salida de cada comando.
- Un backup no se considera válido hasta haber probado su restauración.
