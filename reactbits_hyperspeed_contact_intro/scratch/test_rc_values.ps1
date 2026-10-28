Add-Type -AssemblyName System.Drawing

$srcDir = "public/assets"
$frontImg = [System.Drawing.Bitmap]::FromFile((Resolve-Path "$srcDir/FRONT VIEW.png"))
$rightImg = [System.Drawing.Bitmap]::FromFile((Resolve-Path "$srcDir/RIGHT SIDE.png"))

# Test different rightCropX from 380 to 415 to find the exact seamless boundary
for ($rc = 385; $rc -le 415; $rc += 10) {
    $bmp = New-Object System.Drawing.Bitmap 600, 500
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    # Draw FRONT VIEW right edge: crop 1360..1665 (width 305), drawn at 0..305
    $g.DrawImage($frontImg, (New-Object System.Drawing.Rectangle 0, 0, 305, 500), (New-Object System.Drawing.Rectangle 1360, 500, 305, 500), [System.Drawing.GraphicsUnit]::Pixel)
    
    # Draw RIGHT SIDE starting at $rc (width 295), drawn at 305..600
    $g.DrawImage($rightImg, (New-Object System.Drawing.Rectangle 305, 0, 295, 500), (New-Object System.Drawing.Rectangle $rc, 500, 295, 500), [System.Drawing.GraphicsUnit]::Pixel)
    
    $g.Dispose()
    $bmp.Save("scratch/test_rc_$rc.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $bmp.Dispose()
    Write-Host "Saved test_rc_$rc.jpg"
}

$frontImg.Dispose()
$rightImg.Dispose()
