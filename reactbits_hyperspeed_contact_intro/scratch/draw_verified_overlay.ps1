Add-Type -AssemblyName System.Drawing

$imgPath = "C:/Users/Kausiq/.gemini/antigravity-ide/brain/3a177407-8de8-46bb-8307-41ffa748d903/architectural_workspace_1793164976135.png"
$img = [System.Drawing.Bitmap]::FromFile($imgPath)
$annotated = New-Object System.Drawing.Bitmap $img
$g = [System.Drawing.Graphics]::FromImage($annotated)

$jsonStr = Get-Content "scratch/projected_polygons.json" -Raw
$data = ConvertFrom-Json $jsonStr

foreach ($key in $data.PSObject.Properties.Name) {
    $item = $data.$key
    $pts = @()
    foreach ($pt in $item.corners) {
        $pts += New-Object System.Drawing.Point ($pt[0]), ($pt[1])
    }
    
    $color = [System.Drawing.Color]::FromName($item.color)
    $pen = New-Object System.Drawing.Pen $color, 4
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(60, $color.R, $color.G, $color.B))
    
    $g.FillPolygon($brush, $pts)
    $g.DrawPolygon($pen, $pts)
    
    $pen.Dispose()
    $brush.Dispose()
}

$g.Dispose()
$annotated.Save("scratch/overlay_verified.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$annotated.Dispose()
$img.Dispose()
Write-Host "Saved scratch/overlay_verified.jpg"
