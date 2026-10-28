Add-Type -AssemblyName System.Drawing

$genPath = "C:\Users\Kausiq\.gemini\antigravity-ide\brain\70ef9b1b-1e4e-47c8-bbea-7c8eb325c88b\desk_no_laptop_1793092811654.jpg"
$genImg = [System.Drawing.Bitmap]::FromFile($genPath)
$orig = [System.Drawing.Bitmap]::FromFile((Resolve-Path "scratch/laptop_full.jpg"))

# Let's inspect where features are in $orig:
# $orig size: 550x591
# Mug in $orig: around x=280..380, y=260..370
# Let's find mug center in $orig and in $genImg

Write-Host "Orig: width=$($orig.Width), height=$($orig.Height)"
Write-Host "Gen: width=$($genImg.Width), height=$($genImg.Height)"

# Rescale $genImg to 550x591 or check if it was stretched or letterboxed
# Let's check aspect ratios: 550 / 591 = 0.9306. 1024/1024 = 1.0.
# Usually generate_image either scales to fit 1024x1024 (stretching) or scales with padding or crops.
# Let's check by sampling pixel colors of the mug text "EASYBUILDS" or monitor bezel in both.

# Save a direct resize of genImg to 550x591 to compare diff:
$resized = New-Object System.Drawing.Bitmap $orig.Width, $orig.Height
$g = [System.Drawing.Graphics]::FromImage($resized)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($genImg, (New-Object System.Drawing.Rectangle 0, 0, $orig.Width, $orig.Height), (New-Object System.Drawing.Rectangle 0, 0, $genImg.Width, $genImg.Height), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

$resized.Save("scratch/gen_resized_550x591.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$resized.Dispose()
$genImg.Dispose()
$orig.Dispose()
Write-Host "Saved scratch/gen_resized_550x591.jpg"
