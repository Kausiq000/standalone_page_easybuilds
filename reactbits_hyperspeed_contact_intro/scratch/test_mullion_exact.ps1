Add-Type -AssemblyName System.Drawing

$srcDir = "public/assets"
$leftImg  = [System.Drawing.Bitmap]::FromFile((Resolve-Path "$srcDir/LEFT SIDE.png"))
$frontImg = [System.Drawing.Bitmap]::FromFile((Resolve-Path "$srcDir/FRONT VIEW.png"))

# Test different left crop points connecting to FRONT VIEW at x = 75 (mullion)
# In LEFT SIDE, mullion is around x = 1040
for ($lx = 1030; $lx -le 1055; $lx += 5) {
    $bmp = New-Object System.Drawing.Bitmap 600, 500
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    # Left side drawn 0..300: crop ($lx - 300) to $lx
    $g.DrawImage($leftImg, (New-Object System.Drawing.Rectangle 0, 0, 300, 500), (New-Object System.Drawing.Rectangle ($lx - 300), 250, 300, 500), [System.Drawing.GraphicsUnit]::Pixel)
    
    # Front side drawn 300..600: crop 75..375
    $g.DrawImage($frontImg, (New-Object System.Drawing.Rectangle 300, 0, 300, 500), (New-Object System.Drawing.Rectangle 75, 250, 300, 500), [System.Drawing.GraphicsUnit]::Pixel)
    
    $g.Dispose()
    $bmp.Save("scratch/test_mullion_$lx.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $bmp.Dispose()
    Write-Host "Saved test_mullion_$lx.jpg"
}

$leftImg.Dispose()
$frontImg.Dispose()
