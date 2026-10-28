Add-Type -AssemblyName System.Drawing
$srcDir = "public/assets"
$leftBmp  = [System.Drawing.Bitmap]::FromFile((Resolve-Path "$srcDir/LEFT SIDE.png"))
$rightBmp = [System.Drawing.Bitmap]::FromFile((Resolve-Path "$srcDir/RIGHT SIDE.png"))
$backBmp  = [System.Drawing.Bitmap]::FromFile((Resolve-Path "$srcDir/BACK SIDE.png"))

Write-Host "Left: $($leftBmp.Width) x $($leftBmp.Height)"
Write-Host "Right: $($rightBmp.Width) x $($rightBmp.Height)"
Write-Host "Back: $($backBmp.Width) x $($backBmp.Height)"

# Save downscaled previews so we can view each full wall
function SavePreview($bmp, $filename) {
    $thumb = New-Object System.Drawing.Bitmap 836, 470
    $g = [System.Drawing.Graphics]::FromImage($thumb)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($bmp, 0, 0, 836, 470)
    $g.Dispose()
    $thumb.Save("scratch/$filename", [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $thumb.Dispose()
}

SavePreview $leftBmp "preview_left.jpg"
SavePreview $rightBmp "preview_right.jpg"
SavePreview $backBmp "preview_back.jpg"

$leftBmp.Dispose()
$rightBmp.Dispose()
$backBmp.Dispose()
Write-Host "Previews saved."
