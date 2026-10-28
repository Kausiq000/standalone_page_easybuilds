Add-Type -AssemblyName System.Drawing

$right = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/RIGHT SIDE.png"))

Write-Host "RIGHT SIDE width=$($right.Width), height=$($right.Height)"

# Crop the left edge of RIGHT SIDE: x from 0 to 600, y from 300 to 941
$crop = New-Object System.Drawing.Bitmap 600, 641
$g = [System.Drawing.Graphics]::FromImage($crop)
$g.DrawImage($right, (New-Object System.Drawing.Rectangle 0, 0, 600, 641), (New-Object System.Drawing.Rectangle 0, 300, 600, 641), [System.Drawing.GraphicsUnit]::Pixel)

$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::Yellow), 1
$font = New-Object System.Drawing.Font "Arial", 9
$brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::Yellow)

for ($x = 0; $x -lt 600; $x += 50) {
    $g.DrawLine($pen, $x, 0, $x, 641)
    $g.DrawString("$x", $font, $brush, $x, 5)
}
for ($y = 0; $y -lt 641; $y += 50) {
    $g.DrawLine($pen, 0, $y, 600, $y)
    $g.DrawString("$(300 + $y)", $font, $brush, 5, $y)
}

$g.Dispose()
$crop.Save("scratch/right_side_left_edge.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$crop.Dispose()
$right.Dispose()
Write-Host "Saved scratch/right_side_left_edge.jpg"
