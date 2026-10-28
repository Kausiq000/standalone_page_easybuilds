Add-Type -AssemblyName System.Drawing

$front = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/FRONT VIEW.png"))

Write-Host "FRONT VIEW width=$($front.Width), height=$($front.Height)"

# Crop the right edge of FRONT VIEW: x from 1100 to 1672 (width 572), y from 300 to 941 (height 641)
$crop = New-Object System.Drawing.Bitmap 572, 641
$g = [System.Drawing.Graphics]::FromImage($crop)
$g.DrawImage($front, (New-Object System.Drawing.Rectangle 0, 0, 572, 641), (New-Object System.Drawing.Rectangle 1100, 300, 572, 641), [System.Drawing.GraphicsUnit]::Pixel)

# Draw pixel coordinates
$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::Yellow), 1
$font = New-Object System.Drawing.Font "Arial", 9
$brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::Yellow)

for ($x = 0; $x -lt 572; $x += 50) {
    $g.DrawLine($pen, $x, 0, $x, 641)
    $g.DrawString("$(1100 + $x)", $font, $brush, $x, 5)
}
for ($y = 0; $y -lt 641; $y += 50) {
    $g.DrawLine($pen, 0, $y, 572, $y)
    $g.DrawString("$(300 + $y)", $font, $brush, 5, $y)
}

$g.Dispose()
$crop.Save("scratch/front_right_edge.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$crop.Dispose()
$front.Dispose()
Write-Host "Saved scratch/front_right_edge.jpg"
