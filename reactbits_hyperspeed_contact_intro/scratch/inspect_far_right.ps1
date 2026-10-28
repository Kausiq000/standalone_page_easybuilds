Add-Type -AssemblyName System.Drawing
$frontImg = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/FRONT VIEW.png"))

# Inspect x = 1450 to 1672 (width 222)
$crop = New-Object System.Drawing.Bitmap 222, 941
$g = [System.Drawing.Graphics]::FromImage($crop)
$g.DrawImage($frontImg, (New-Object System.Drawing.Rectangle 0, 0, 222, 941), (New-Object System.Drawing.Rectangle 1450, 0, 222, 941), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$crop.Save("scratch/front_far_right.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$crop.Dispose()
$frontImg.Dispose()
Write-Host "Saved front_far_right.jpg"
