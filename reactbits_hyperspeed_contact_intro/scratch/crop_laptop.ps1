Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/FRONT VIEW.png"))
Write-Host "FRONT VIEW dimensions: $($img.Width)x$($img.Height)"

# The laptop is on the left side of the desk in FRONT VIEW.
# Let's crop from x=300 to x=800, y=400 to y=941
$cropX = 300
$cropY = 400
$cropW = 500
$cropH = 500

$crop = New-Object System.Drawing.Bitmap $cropW, $cropH
$g = [System.Drawing.Graphics]::FromImage($crop)
$g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $cropW, $cropH), (New-Object System.Drawing.Rectangle $cropX, $cropY, $cropW, $cropH), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

$crop.Save("scratch/laptop_crop.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$crop.Dispose()
$img.Dispose()
Write-Host "Saved scratch/laptop_crop.jpg successfully."
