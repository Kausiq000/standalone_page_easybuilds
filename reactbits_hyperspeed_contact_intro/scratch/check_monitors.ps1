Add-Type -AssemblyName System.Drawing
$b = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/FRONT VIEW.png"))
Write-Host "Width: $($b.Width) Height: $($b.Height)"

# In FRONT VIEW.png (1672x941):
# Where is the desk and the monitors?
# Let's save a crop of center (x: 500..1200, y: 400..900)
$crop = New-Object System.Drawing.Bitmap 700, 500
$g = [System.Drawing.Graphics]::FromImage($crop)
$g.DrawImage($b, (New-Object System.Drawing.Rectangle 0, 0, 700, 500), (New-Object System.Drawing.Rectangle 486, 400, 700, 500), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$crop.Save("scratch/monitors_crop.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$crop.Dispose()
$b.Dispose()
Write-Host "Crop saved."
