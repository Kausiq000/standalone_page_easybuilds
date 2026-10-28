Add-Type -AssemblyName System.Drawing
$imgPath = "C:/Users/Kausiq/.gemini/antigravity-ide/brain/3a177407-8de8-46bb-8307-41ffa748d903/architectural_workspace_1793164976135.png"
$img = [System.Drawing.Bitmap]::FromFile($imgPath)
Write-Host "Image dimensions: $($img.Width) x $($img.Height)"

# Now let's test drawing bounding boxes on top of this screenshot to see where our 3D hotspots project!
$annotated = New-Object System.Drawing.Bitmap $img
$g = [System.Drawing.Graphics]::FromImage($annotated)

# Let's save a copy with grid lines every 100px so we can read the exact coordinates of the frames and monitors!
$pen100 = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(80, 255, 255, 255)), 1
$pen500 = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(180, 255, 255, 0)), 2
$font = New-Object System.Drawing.Font "Arial", 9
$brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)

for ($x = 0; $x -lt $img.Width; $x += 100) {
    $p = if ($x % 500 -eq 0) { $pen500 } else { $pen100 }
    $g.DrawLine($p, $x, 0, $x, $img.Height)
    $g.DrawString("$x", $font, $brush, ($x + 2), 25)
}

for ($y = 0; $y -lt $img.Height; $y += 100) {
    $p = if ($y % 500 -eq 0) { $pen500 } else { $pen100 }
    $g.DrawLine($p, 0, $y, $img.Width, $y)
    $g.DrawString("$y", $font, $brush, 5, ($y + 2))
}

$g.Dispose()
$annotated.Save("scratch/screenshot_grid.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$annotated.Dispose()
$img.Dispose()
Write-Host "Saved scratch/screenshot_grid.jpg"
