Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Bitmap]::FromFile((Resolve-Path "scratch/laptop_full.jpg"))
$g = [System.Drawing.Graphics]::FromImage($img)

# Let's draw grid lines every 50 pixels and labels
$font = New-Object System.Drawing.Font "Arial", 10
$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::Yellow), 1
$brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::Yellow)

for ($x = 0; $x -lt $img.Width; $x += 50) {
    $g.DrawLine($pen, $x, 0, $x, $img.Height)
    $g.DrawString("$x", $font, $brush, $x, 5)
}
for ($y = 0; $y -lt $img.Height; $y += 50) {
    $g.DrawLine($pen, 0, $y, $img.Width, $y)
    $g.DrawString("$y", $font, $brush, 5, $y)
}

$g.Dispose()
$img.Save("scratch/laptop_grid.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$img.Dispose()
Write-Host "Saved scratch/laptop_grid.jpg"
