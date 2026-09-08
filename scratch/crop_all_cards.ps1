Add-Type -AssemblyName System.Drawing

$images = @(
    @{ id = "01"; file = "WhatsApp Image 2026-09-06 at 4.40.30 PM.jpeg"; out = "vertical-card-01.png" },
    @{ id = "02"; file = "WhatsApp Image 2026-09-06 at 4.40.30 PM (1).jpeg"; out = "vertical-card-02.png" },
    @{ id = "03"; file = "WhatsApp Image 2026-09-06 at 4.40.29 PM.jpeg"; out = "vertical-card-03.png" },
    @{ id = "04"; file = "WhatsApp Image 2026-09-06 at 4.40.29 PM (2).jpeg"; out = "vertical-card-04.png" },
    @{ id = "05"; file = "WhatsApp Image 2026-09-06 at 4.40.29 PM (1).jpeg"; out = "vertical-card-05.png" },
    @{ id = "06"; file = "WhatsApp Image 2026-09-06 at 4.40.30 PM (2).jpeg"; out = "vertical-card-06.png" }
)

$baseDir = "c:\xampp\htdocs\abmfm-html\img\verticals"

# Let's inspect the boundary: in 1600x903, the left card rounded rectangle starts around x=30, y=28, width=712, height=848.
# Let's check where the card ends and where the white background begins.
foreach ($item in $images) {
    $srcPath = Join-Path $baseDir $item.file
    $outPath = Join-Path $baseDir $item.out
    $bmp = New-Object System.Drawing.Bitmap($srcPath)
    
    # Exact card dimensions:
    $rect = New-Object System.Drawing.Rectangle(25, 25, 715, 852)
    $crop = $bmp.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $crop.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $bmp.Dispose()
    $crop.Dispose()
    Write-Host "Processed $($item.id) -> $($item.out)"
}
