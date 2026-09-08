Add-Type -AssemblyName System.Drawing

$images = @(
    @{ id = "01"; file = "WhatsApp Image 2026-09-06 at 4.40.30 PM.jpeg" },
    @{ id = "02"; file = "WhatsApp Image 2026-09-06 at 4.40.30 PM (1).jpeg" },
    @{ id = "03"; file = "WhatsApp Image 2026-09-06 at 4.40.29 PM.jpeg" },
    @{ id = "04"; file = "WhatsApp Image 2026-09-06 at 4.40.29 PM (2).jpeg" },
    @{ id = "05"; file = "WhatsApp Image 2026-09-06 at 4.40.29 PM (1).jpeg" },
    @{ id = "06"; file = "WhatsApp Image 2026-09-06 at 4.40.30 PM (2).jpeg" }
)

$baseDir = "c:\xampp\htdocs\abmfm-html\img\verticals"

# For each image, let's find the card's right boundary by scanning horizontally around y = 400 from x = 600 to 750
# The card has a photo with non-white pixels, and right next to it is the white slide background (R>245, G>245, B>245)
foreach ($item in $images) {
    $srcPath = Join-Path $baseDir $item.file
    $bmp = New-Object System.Drawing.Bitmap($srcPath)
    
    # Check top boundary around x = 350
    $topY = 0
    for ($y = 10; $y -lt 100; $y++) {
        $c = $bmp.GetPixel(350, $y)
        if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
            $topY = $y
            break
        }
    }

    # Check left boundary around y = 400
    $leftX = 0
    for ($x = 10; $x -lt 100; $x++) {
        $c = $bmp.GetPixel($x, 400)
        if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
            $leftX = $x
            break
        }
    }

    # Check right boundary around y = 400
    $rightX = 0
    for ($x = 750; $x -gt 550; $x--) {
        $c = $bmp.GetPixel($x, 400)
        if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
            $rightX = $x
            break
        }
    }

    # Check bottom boundary around x = 350
    $bottomY = 0
    for ($y = 890; $y -gt 750; $y--) {
        $c = $bmp.GetPixel(350, $y)
        if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
            $bottomY = $y
            break
        }
    }

    Write-Host "$($item.id): left=$leftX, top=$topY, right=$rightX, bottom=$bottomY, width=$($rightX - $leftX), height=$($bottomY - $topY)"
    $bmp.Dispose()
}
