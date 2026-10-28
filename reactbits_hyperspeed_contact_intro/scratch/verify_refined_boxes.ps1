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

# Refined boxes:
# 1. Hosting: 235, 95, 175, 125
$g.DrawRectangle($pHosting, 235, 95, 175, 125)

# 2. UI/UX: 235, 240, 175, 125
$g.DrawRectangle($pUIUX, 235, 240, 175, 125)

# 3. Management: 1148, 95, 174, 125
$g.DrawRectangle($pMgmt, 1148, 95, 174, 125)

# 4. Web Dev: 1148, 240, 174, 125
$g.DrawRectangle($pWebDev, 1148, 240, 174, 125)

# Left Monitor: 200, 395, 370, 265
$g.DrawRectangle($pMonLeft, 200, 395, 370, 265)

# Center Monitor: 580, 395, 430, 250
$g.DrawRectangle($pMonCenter, 580, 395, 430, 250)

# Right Monitor: 1020, 395, 370, 265
$g.DrawRectangle($pMonRight, 1020, 395, 370, 265)

$g.Dispose()
$annotated.Save("scratch/annotated_boxes_refined.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$annotated.Dispose()
$front.Dispose()
Write-Host "Saved annotated_boxes_refined.jpg"
