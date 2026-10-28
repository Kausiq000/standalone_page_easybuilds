Add-Type -AssemblyName System.Drawing
$dir = "C:\Users\Kausiq\.gemini\antigravity-ide\brain\70ef9b1b-1e4e-47c8-bbea-7c8eb325c88b\.tempmediaStorage"
Get-ChildItem -Path $dir | ForEach-Object {
    try {
        $img = [System.Drawing.Image]::FromFile($_.FullName)
        [PSCustomObject]@{
            Name = $_.Name
            Width = $img.Width
            Height = $img.Height
            SizeKB = [math]::Round($_.Length / 1024, 1)
        }
        $img.Dispose()
    } catch {}
} | Sort-Object Width -Descending | Format-Table -AutoSize
