Add-Type -AssemblyName System.Drawing
$front = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/FRONT VIEW.png"))

# Let's inspect the 4 frames:
# 1. Hosting & Deployment (top left)
# 2. UI/UX Design (bottom left)
# 3. Website Management (top right)
# 4. Website Development (bottom right)

# Save crop around top-left frame (Hosting)
$c1 = New-Object System.Drawing.Bitmap 300, 200
$g1 = [System.Drawing.Graphics]::FromImage($c1)
$g1.DrawImage($front, (New-Object System.Drawing.Rectangle 0, 0, 300, 200), (New-Object System.Drawing.Rectangle 180, 80, 300, 200), [System.Drawing.GraphicsUnit]::Pixel)
$g1.Dispose()
$c1.Save("scratch/frame_hosting_crop.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$c1.Dispose()

# Save crop around bottom-left frame (UI/UX)
$c2 = New-Object System.Drawing.Bitmap 300, 200
$g2 = [System.Drawing.Graphics]::FromImage($c2)
$g2.DrawImage($front, (New-Object System.Drawing.Rectangle 0, 0, 300, 200), (New-Object System.Drawing.Rectangle 180, 230, 300, 200), [System.Drawing.GraphicsUnit]::Pixel)
$g2.Dispose()
$c2.Save("scratch/frame_uiux_crop.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$c2.Dispose()

# Save crop around top-right frame (Management)
$c3 = New-Object System.Drawing.Bitmap 300, 200
$g3 = [System.Drawing.Graphics]::FromImage($c3)
$g3.DrawImage($front, (New-Object System.Drawing.Rectangle 0, 0, 300, 200), (New-Object System.Drawing.Rectangle 1180, 60, 300, 200), [System.Drawing.GraphicsUnit]::Pixel)
$g3.Dispose()
$c3.Save("scratch/frame_management_crop.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$c3.Dispose()

# Save crop around bottom-right frame (Web Dev)
$c4 = New-Object System.Drawing.Bitmap 300, 200
$g4 = [System.Drawing.Graphics]::FromImage($c4)
$g4.DrawImage($front, (New-Object System.Drawing.Rectangle 0, 0, 300, 200), (New-Object System.Drawing.Rectangle 1180, 210, 300, 200), [System.Drawing.GraphicsUnit]::Pixel)
$g4.Dispose()
$c4.Save("scratch/frame_webdev_crop.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$c4.Dispose()

# Save crop around Left Monitor, Center Monitor, Right Monitor
$cm1 = New-Object System.Drawing.Bitmap 450, 350
$gm1 = [System.Drawing.Graphics]::FromImage($cm1)
$gm1.DrawImage($front, (New-Object System.Drawing.Rectangle 0, 0, 450, 350), (New-Object System.Drawing.Rectangle 200, 380, 450, 350), [System.Drawing.GraphicsUnit]::Pixel)
$gm1.Dispose()
$cm1.Save("scratch/monitors_left_crop.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$cm1.Dispose()

$cm2 = New-Object System.Drawing.Bitmap 450, 350
$gm2 = [System.Drawing.Graphics]::FromImage($cm2)
$gm2.DrawImage($front, (New-Object System.Drawing.Rectangle 0, 0, 450, 350), (New-Object System.Drawing.Rectangle 610, 380, 450, 350), [System.Drawing.GraphicsUnit]::Pixel)
$gm2.Dispose()
$cm2.Save("scratch/monitors_center_crop.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$cm2.Dispose()

$cm3 = New-Object System.Drawing.Bitmap 450, 350
$gm3 = [System.Drawing.Graphics]::FromImage($cm3)
$gm3.DrawImage($front, (New-Object System.Drawing.Rectangle 0, 0, 450, 350), (New-Object System.Drawing.Rectangle 1030, 380, 450, 350), [System.Drawing.GraphicsUnit]::Pixel)
$gm3.Dispose()
$cm3.Save("scratch/monitors_right_crop.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$cm3.Dispose()

$front.Dispose()
Write-Host "Crops saved."
