Add-Type -AssemblyName System.Drawing

$crops = @(
    @{ id = "01"; file = "WhatsApp Image 2026-09-06 at 4.40.30 PM.jpeg"; x = 0; y = 0; w = 742; h = 903 },
    @{ id = "02"; file = "WhatsApp Image 2026-09-06 at 4.40.30 PM (1).jpeg"; x = 0; y = 0; w = 742; h = 903 },
    @{ id = "03"; file = "WhatsApp Image 2026-09-06 at 4.40.29 PM.jpeg"; x = 0; y = 0; w = 702; h = 903 },
    @{ id = "04"; file = "WhatsApp Image 2026-09-06 at 4.40.29 PM (2).jpeg"; x = 0; y = 0; w = 742; h = 903 },
    @{ id = "05"; file = "WhatsApp Image 2026-09-06 at 4.40.29 PM (1).jpeg"; x = 0; y = 0; w = 655; h = 903 },
    @{ id = "06"; file = "WhatsApp Image 2026-09-06 at 4.40.30 PM (2).jpeg"; x = 0; y = 0; w = 742; h = 903 }
)

$baseDir = "c:\xampp\htdocs\abmfm-html\img\verticals"

foreach ($item in $crops) {
    $srcPath = Join-Path $baseDir $item.file
    $outPath = Join-Path $baseDir "vertical-panel-$($item.id).png"
    $bmp = New-Object System.Drawing.Bitmap($srcPath)
    
    $rect = New-Object System.Drawing.Rectangle($item.x, $item.y, $item.w, $item.h)
    $crop = $bmp.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $crop.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $bmp.Dispose()
    $crop.Dispose()
    Write-Host "Created vertical-panel-$($item.id).png ($($item.w)x$($item.h))"
}
