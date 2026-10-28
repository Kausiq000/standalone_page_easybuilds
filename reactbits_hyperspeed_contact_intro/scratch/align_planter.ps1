Add-Type -AssemblyName System.Drawing

$leftSidePath = "public/assets/LEFT SIDE.png"
$genPath = "C:\Users\Kausiq\.gemini\antigravity-ide\brain\70ef9b1b-1e4e-47c8-bbea-7c8eb325c88b\clean_lounge_wall_1793097654357.jpg"

$leftBmp = [System.Drawing.Bitmap]::FromFile((Resolve-Path $leftSidePath))
$genBmp  = [System.Drawing.Bitmap]::FromFile($genPath)

# We want to match the region x: 0..450, y: 200..941
# Let's inspect where the vertical corner of the slats is in both images.
# In leftSide, the outer slat wall corner is at x = 0 (or wall edge).
# The left picture frame in leftSide:
# Let's find picture frame bounds in leftSide and genBmp.

# Save scaled genBmp to 450 x 741 for direct comparison
$scaledGen = New-Object System.Drawing.Bitmap 450, 741
$g = [System.Drawing.Graphics]::FromImage($scaledGen)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($genBmp, (New-Object System.Drawing.Rectangle 0, 0, 450, 741))
$g.Dispose()

$scaledGen.Save("scratch/gen_scaled_450x741.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)

# Also create a 50/50 blend preview of left_side_planter_crop vs gen_scaled
$cropBmp = [System.Drawing.Bitmap]::FromFile("scratch/left_side_planter_crop.jpg")
$blend = New-Object System.Drawing.Bitmap 450, 741
$gb = [System.Drawing.Graphics]::FromImage($blend)
$gb.DrawImage($cropBmp, 0, 0)
# Draw gen with 50% opacity
$cm = New-Object System.Drawing.Imaging.ColorMatrix
$cm.Matrix33 = 0.5f
$ia = New-Object System.Drawing.Imaging.ImageAttributes
$ia.SetColorMatrix($cm)
$gb.DrawImage($scaledGen, (New-Object System.Drawing.Rectangle 0, 0, 450, 741), 0, 0, 450, 741, [System.Drawing.GraphicsUnit]::Pixel, $ia)
$gb.Dispose()

$blend.Save("scratch/planter_blend_check.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)

$scaledGen.Dispose()
$cropBmp.Dispose()
$blend.Dispose()
$leftBmp.Dispose()
$genBmp.Dispose()

Write-Host "Generated comparison images in scratch/"
