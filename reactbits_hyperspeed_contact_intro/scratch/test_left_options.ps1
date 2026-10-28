Add-Type -AssemblyName System.Drawing

$srcDir = "public/assets"
$leftImg  = [System.Drawing.Bitmap]::FromFile((Resolve-Path "$srcDir/LEFT SIDE.png"))
$frontImg = [System.Drawing.Bitmap]::FromFile((Resolve-Path "$srcDir/FRONT VIEW.png"))

# Option 1: Current test_seam1 (Front at x = 75)
# Option 2: Front at x = 230 (Window entirely from LEFT SIDE)
# Let's inspect LEFT SIDE around x = 1000..1200
$bmpOpt2 = New-Object System.Drawing.Bitmap 600, 500
$g2 = [System.Drawing.Graphics]::FromImage($bmpOpt2)
# Left drawn 0..350: crop 800..1150 (width 350)
$g2.DrawImage($leftImg, (New-Object System.Drawing.Rectangle 0, 0, 350, 500), (New-Object System.Drawing.Rectangle 800, 300, 350, 500), [System.Drawing.GraphicsUnit]::Pixel)
# Front drawn 350..600: crop 230..480 (width 250)
$g2.DrawImage($frontImg, (New-Object System.Drawing.Rectangle 350, 0, 250, 500), (New-Object System.Drawing.Rectangle 230, 300, 250, 500), [System.Drawing.GraphicsUnit]::Pixel)
$g2.Dispose()
$bmpOpt2.Save("scratch/test_opt2_fluted_corner.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmpOpt2.Dispose()

$leftImg.Dispose()
$frontImg.Dispose()
Write-Host "Option 2 saved."
