Add-Type -AssemblyName System.Drawing

$front = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/FRONT VIEW.png"))
$annotated = New-Object System.Drawing.Bitmap $front
$g = [System.Drawing.Graphics]::FromImage($annotated)

$pHosting = New-Object System.Drawing.Pen ([System.Drawing.Color]::Cyan), 3
$pUIUX = New-Object System.Drawing.Pen ([System.Drawing.Color]::Magenta), 3
$pMgmt = New-Object System.Drawing.Pen ([System.Drawing.Color]::Lime), 3
$pWebDev = New-Object System.Drawing.Pen ([System.Drawing.Color]::Gold), 3

$pMonLeft = New-Object System.Drawing.Pen ([System.Drawing.Color]::Orange), 3
$pMonCenter = New-Object System.Drawing.Pen ([System.Drawing.Color]::Red), 3
$pMonRight = New-Object System.Drawing.Pen ([System.Drawing.Color]::Yellow), 3

# Perfectly calibrated boxes in FRONT VIEW.png coords:
# 1. Hosting: 355, 95, 180, 130
$g.DrawRectangle($pHosting, 355, 95, 180, 130)

# 2. UI/UX: 355, 240, 180, 130
$g.DrawRectangle($pUIUX, 355, 240, 180, 130)

# 3. Management: 1148, 95, 180, 130
$g.DrawRectangle($pMgmt, 1148, 95, 180, 130)

# 4. Web Dev: 1148, 240, 180, 130
$g.DrawRectangle($pWebDev, 1148, 240, 180, 130)

# Left Monitor: 340, 395, 370, 260
$g.DrawRectangle($pMonLeft, 340, 395, 370, 260)

# Center Monitor: 710, 395, 390, 255
$g.DrawRectangle($pMonCenter, 710, 395, 390, 255)

# Right Monitor: 1100, 395, 370, 260
$g.DrawRectangle($pMonRight, 1100, 395, 370, 260)

$g.Dispose()
$annotated.Save("scratch/annotated_boxes_perfect.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$annotated.Dispose()
$front.Dispose()
Write-Host "Saved annotated_boxes_perfect.jpg"
