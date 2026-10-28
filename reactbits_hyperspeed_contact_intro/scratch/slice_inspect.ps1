Add-Type -AssemblyName System.Drawing
$b = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/easybuilds_office_360.jpg"))
$sections = @(
    @{name='front_right'; x=2400},
    @{name='right_conference'; x=2900},
    @{name='right_back'; x=3400},
    @{name='back_whiteboard'; x=3900},
    @{name='back_left'; x=400},
    @{name='left_lounge'; x=900},
    @{name='left_front'; x=1250}
)
foreach ($sec in $sections) {
    $bmp = New-Object System.Drawing.Bitmap 600, 500
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.DrawImage($b, (New-Object System.Drawing.Rectangle 0, 0, 600, 500), (New-Object System.Drawing.Rectangle $sec.x, 500, 600, 500), [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $bmp.Save("scratch/inspect_" + $sec.name + ".jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $bmp.Dispose()
    Write-Host ("Saved inspect_" + $sec.name)
}
$b.Dispose()
