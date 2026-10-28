Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap 100, 100
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::Blue)
$g.Dispose()
Write-Host "System.Drawing works! Dimensions: $($bmp.Width)x$($bmp.Height)"
$bmp.Dispose()
