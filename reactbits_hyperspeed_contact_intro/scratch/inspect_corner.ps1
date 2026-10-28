Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/FRONT VIEW.png"))

# In FRONT VIEW.png:
# Where is the front-right corner of the laptop base?
# Where is the mug?
# Where is the notepad?
# Let's crop from x=400 to 550, y=600 to 750 (which is inside cropX=60, cropY=340)
# Note: cropX=60, so x in crop = x_front - 60
# cropY=340, so y in crop = y_front - 340
# If x_front = 450, x in crop = 390!
# If y_front = 680, y in crop = 340!

$crop = New-Object System.Drawing.Bitmap 300, 300
$g = [System.Drawing.Graphics]::FromImage($crop)
$g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, 300, 300), (New-Object System.Drawing.Rectangle 350, 600, 300, 300), [System.Drawing.GraphicsUnit]::Pixel)

# Draw red grid
$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::Red), 1
$font = New-Object System.Drawing.Font "Arial", 9
$brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::Red)

for ($x = 0; $x -lt 300; $x += 30) {
    $g.DrawLine($pen, $x, 0, $x, 300)
    $g.DrawString("$(350 + $x)", $font, $brush, $x, 2)
}
for ($y = 0; $y -lt 300; $y += 30) {
    $g.DrawLine($pen, 0, $y, 300, $y)
    $g.DrawString("$(600 + $y)", $font, $brush, 2, $y)
}
$g.Dispose()

$crop.Save("scratch/corner_inspect.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$crop.Dispose()
$img.Dispose()
Write-Host "Saved scratch/corner_inspect.jpg"
