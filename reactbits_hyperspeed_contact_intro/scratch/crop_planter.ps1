Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/LEFT SIDE.png"))
$crop = New-Object System.Drawing.Bitmap 450, 741
$g = [System.Drawing.Graphics]::FromImage($crop)
$g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, 450, 741), (New-Object System.Drawing.Rectangle 0, 200, 450, 741), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$crop.Save("scratch/left_side_planter_crop.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$crop.Dispose()
$img.Dispose()
Write-Host "Saved left_side_planter_crop.jpg"
