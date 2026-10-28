Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile((Resolve-Path "scratch/office_lounge_side.png"))
# In office_lounge_side.png (1920x1080), crop the left wall pictures
$crop = New-Object System.Drawing.Bitmap 300, 500
$g = [System.Drawing.Graphics]::FromImage($crop)
$g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, 300, 500), (New-Object System.Drawing.Rectangle 0, 80, 300, 500), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$crop.Save("scratch/office_lounge_frame_crop.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$crop.Dispose()
$img.Dispose()
Write-Host "Saved office_lounge_frame_crop.jpg"
