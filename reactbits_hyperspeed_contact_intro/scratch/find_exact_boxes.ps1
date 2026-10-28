Add-Type -AssemblyName System.Drawing

$front = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/FRONT VIEW.png"))

# Create an annotated image with red outlines around our guessed boxes to check them against the real elements
$annotated = New-Object System.Drawing.Bitmap $front
$g = [System.Drawing.Graphics]::FromImage($annotated)
$redPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::Red), 3
$yellowPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::Yellow), 3
$cyanPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::Cyan), 3
$greenPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::Lime), 3

# Test candidate boxes in FRONT VIEW.png coords (1672x941):
# Top Left Frame (Hosting):
# Let's outline x=210, y=95, w=200, h=140
$g.DrawRectangle($redPen, 210, 95, 200, 140)

# Bottom Left Frame (UI/UX):
# Let's outline x=210, y=250, w=200, h=140
$g.DrawRectangle($yellowPen, 210, 250, 200, 140)

# Top Right Frame (Management):
# Let's outline x=1250, y=95, w=200, h=140
$g.DrawRectangle($cyanPen, 1250, 95, 200, 140)

# Bottom Right Frame (Web Dev):
# Let's outline x=1250, y=250, w=200, h=140
$g.DrawRectangle($greenPen, 1250, 250, 200, 140)

# Left Monitor:
# Let's outline x=260, y=410, w=350, h=250
$g.DrawRectangle($redPen, 260, 410, 350, 250)

# Center Monitor:
# Let's outline x=660, y=410, w=350, h=250
$g.DrawRectangle($yellowPen, 660, 410, 350, 250)

# Right Monitor:
# Let's outline x=1060, y=410, w=350, h=250
$g.DrawRectangle($cyanPen, 1060, 410, 350, 250)

$g.Dispose()

# Save preview of annotated front
$annotated.Save("scratch/annotated_boxes_check.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$annotated.Dispose()
$front.Dispose()
Write-Host "Saved annotated_boxes_check.jpg"
