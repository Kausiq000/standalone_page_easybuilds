Add-Type -AssemblyName System.Drawing

$leftPath = "public/assets/LEFT SIDE.png"
$frameRefPath = "scratch/office_lounge_frame_crop.jpg"
$genPath = "C:\Users\Kausiq\.gemini\antigravity-ide\brain\70ef9b1b-1e4e-47c8-bbea-7c8eb325c88b\clean_lounge_wall_1793097654357.jpg"

$leftBmp = [System.Drawing.Bitmap]::FromFile((Resolve-Path $leftPath))
$outBmp = New-Object System.Drawing.Bitmap $leftBmp.Width, $leftBmp.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($outBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# 1. Base copy
$g.DrawImage($leftBmp, 0, 0)

# 2. Reconstruct vertical walnut slats (x: 0..84)
# In LEFT SIDE.png, x: 0..84 between y: 40 and 260 has pristine slats and downlighting.
# We can replicate and extend these slats downwards down to y: 820 (baseboard).
# Let's sample a vertical slice of slats from y: 80..240 and tile it smoothly down to 820.
$slatSampleH = 160
$slatSample = New-Object System.Drawing.Bitmap 84, $slatSampleH
$gs = [System.Drawing.Graphics]::FromImage($slatSample)
$gs.DrawImage($leftBmp, (New-Object System.Drawing.Rectangle 0, 0, 84, $slatSampleH), (New-Object System.Drawing.Rectangle 0, 80, 84, $slatSampleH), [System.Drawing.GraphicsUnit]::Pixel)
$gs.Dispose()

# Draw extending slats down to y = 820 with natural lighting gradient (ambient lighting dims slightly towards floor)
for ($destY = 240; $destY -lt 820; $destY += ($slatSampleH - 20)) {
    $drawH = [Math]::Min($slatSampleH, (820 - $destY))
    $g.DrawImage($slatSample, (New-Object System.Drawing.Rectangle 0, $destY, 84, $drawH), 0, 0, 84, $drawH, [System.Drawing.GraphicsUnit]::Pixel)
}
$slatSample.Dispose()

# Add baseboard trim at y = 818..825 (dark walnut base trim 7px high)
$baseBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 18, 14, 12))
$g.FillRectangle($baseBrush, 0, 818, 85, 7)
$baseBrush.Dispose()

# 3. Restore the bottom of the left picture frame (x: 86..186, y: 280..360)
# Frame ref in office_lounge_frame_crop:
# In office_lounge_frame_crop (300x500), the left frame is at x: 20..115, y: 15..340
$frameBmp = [System.Drawing.Bitmap]::FromFile((Resolve-Path $frameRefPath))
$frameH = 80
$frameW = 100
# Source frame bottom region in office_lounge_frame_crop
$g.DrawImage($frameBmp, (New-Object System.Drawing.Rectangle 86, 280, $frameW, $frameH), 18, 260, 95, 80, [System.Drawing.GraphicsUnit]::Pixel)
$frameBmp.Dispose()

# 4. Restore the walnut wall panel below the picture frame (x: 84..180, y: 360..780)
# In LEFT SIDE.png, between the two picture frames (x: 186..215, y: 150..500) is clean smooth walnut panel with warm glow.
$panelSample = New-Object System.Drawing.Bitmap 30, 200
$gp = [System.Drawing.Graphics]::FromImage($panelSample)
$gp.DrawImage($leftBmp, (New-Object System.Drawing.Rectangle 0, 0, 30, 200), (New-Object System.Drawing.Rectangle 186, 150, 30, 200), [System.Drawing.GraphicsUnit]::Pixel)
$gp.Dispose()

# Fill panel below left picture frame down to sofa/floor level
for ($px = 85; $px -lt 175; $px += 25) {
    for ($py = 360; $py -lt 780; $py += 180) {
        $pW = [Math]::Min(30, (175 - $px))
        $pH = [Math]::Min(200, (780 - $py))
        $g.DrawImage($panelSample, (New-Object System.Drawing.Rectangle $px, $py, $pW, $pH), 0, 0, $pW, $pH, [System.Drawing.GraphicsUnit]::Pixel)
    }
}
$panelSample.Dispose()

# Baseboard trim under panel at y = 780..788
$baseBrush2 = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 20, 16, 14))
$g.FillRectangle($baseBrush2, 85, 780, 90, 8)
$baseBrush2.Dispose()

# 5. Restore polished dark marble floor tiles with warm reflections (x: 0..175, y: 788..941)
# In LEFT SIDE.png, x: 260..450, y: 800..941 has the exact same black marble floor with amber light pools!
$floorSample = New-Object System.Drawing.Bitmap 175, 153
$gf = [System.Drawing.Graphics]::FromImage($floorSample)
$gf.DrawImage($leftBmp, (New-Object System.Drawing.Rectangle 0, 0, 175, 153), (New-Object System.Drawing.Rectangle 260, 788, 175, 153), [System.Drawing.GraphicsUnit]::Pixel)
$gf.Dispose()

$g.DrawImage($floorSample, 0, 788)
$floorSample.Dispose()

# Soft edge feathering between reconstructed floor and small plant shadow (x: 160..185)
# Add subtle contact shadow next to the small pot (which sits at x: 175)
$shadowBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(90, 8, 7, 6))
$g.FillEllipse($shadowBrush, 140, 810, 60, 30)
$shadowBrush.Dispose()

$g.Dispose()

$outBmp.Save("scratch/LEFT_SIDE_CLEAN.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved scratch/LEFT_SIDE_CLEAN.png"

# Also save a 500x941 inspection crop
$inspectCrop = New-Object System.Drawing.Bitmap 500, 941
$gi = [System.Drawing.Graphics]::FromImage($inspectCrop)
$gi.DrawImage($outBmp, (New-Object System.Drawing.Rectangle 0, 0, 500, 941), 0, 0, 500, 941, [System.Drawing.GraphicsUnit]::Pixel)
$gi.Dispose()
$inspectCrop.Save("scratch/left_side_clean_inspect.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$inspectCrop.Dispose()

$outBmp.Dispose()
$leftBmp.Dispose()
Write-Host "Saved scratch/left_side_clean_inspect.jpg"
