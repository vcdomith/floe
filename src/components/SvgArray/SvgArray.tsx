import { useEffect, useState } from "react"


const SvgArray = ({ className, interval }) => {


    const svg0 = () => {
        return (
            <svg id="visual" viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1"><path d="M0 55L21.5 58C43 61 86 67 128.8 67C171.7 67 214.3 61 257.2 59.5C300 58 343 61 385.8 61C428.7 61 471.3 58 514.2 55C557 52 600 49 642.8 47.5C685.7 46 728.3 46 771.2 50.5C814 55 857 64 878.5 68.5L900 73L900 0L878.5 0C857 0 814 0 771.2 0C728.3 0 685.7 0 642.8 0C600 0 557 0 514.2 0C471.3 0 428.7 0 385.8 0C343 0 300 0 257.2 0C214.3 0 171.7 0 128.8 0C86 0 43 0 21.5 0L0 0Z" fill="#591c4a"></path><path d="M0 100L21.5 101.5C43 103 86 106 128.8 103C171.7 100 214.3 91 257.2 89.5C300 88 343 94 385.8 97C428.7 100 471.3 100 514.2 95.5C557 91 600 82 642.8 79C685.7 76 728.3 79 771.2 83.5C814 88 857 94 878.5 97L900 100L900 71L878.5 66.5C857 62 814 53 771.2 48.5C728.3 44 685.7 44 642.8 45.5C600 47 557 50 514.2 53C471.3 56 428.7 59 385.8 59C343 59 300 56 257.2 57.5C214.3 59 171.7 65 128.8 65C86 65 43 59 21.5 56L0 53Z" fill="#6e2a4f"></path><path d="M0 145L21.5 146.5C43 148 86 151 128.8 149.5C171.7 148 214.3 142 257.2 139C300 136 343 136 385.8 134.5C428.7 133 471.3 130 514.2 127C557 124 600 121 642.8 119.5C685.7 118 728.3 118 771.2 124C814 130 857 142 878.5 148L900 154L900 98L878.5 95C857 92 814 86 771.2 81.5C728.3 77 685.7 74 642.8 77C600 80 557 89 514.2 93.5C471.3 98 428.7 98 385.8 95C343 92 300 86 257.2 87.5C214.3 89 171.7 98 128.8 101C86 104 43 101 21.5 99.5L0 98Z" fill="#813a54"></path><path d="M0 271L21.5 268C43 265 86 259 128.8 257.5C171.7 256 214.3 259 257.2 257.5C300 256 343 250 385.8 244C428.7 238 471.3 232 514.2 229C557 226 600 226 642.8 229C685.7 232 728.3 238 771.2 241C814 244 857 244 878.5 244L900 244L900 152L878.5 146C857 140 814 128 771.2 122C728.3 116 685.7 116 642.8 117.5C600 119 557 122 514.2 125C471.3 128 428.7 131 385.8 132.5C343 134 300 134 257.2 137C214.3 140 171.7 146 128.8 147.5C86 149 43 146 21.5 144.5L0 143Z" fill="#924b59"></path><path d="M0 316L21.5 314.5C43 313 86 310 128.8 307C171.7 304 214.3 301 257.2 298C300 295 343 292 385.8 286C428.7 280 471.3 271 514.2 266.5C557 262 600 262 642.8 265C685.7 268 728.3 274 771.2 278.5C814 283 857 286 878.5 287.5L900 289L900 242L878.5 242C857 242 814 242 771.2 239C728.3 236 685.7 230 642.8 227C600 224 557 224 514.2 227C471.3 230 428.7 236 385.8 242C343 248 300 254 257.2 255.5C214.3 257 171.7 254 128.8 255.5C86 257 43 263 21.5 266L0 269Z" fill="#a25d60"></path><path d="M0 388L21.5 386.5C43 385 86 382 128.8 380.5C171.7 379 214.3 379 257.2 377.5C300 376 343 373 385.8 368.5C428.7 364 471.3 358 514.2 352C557 346 600 340 642.8 343C685.7 346 728.3 358 771.2 361C814 364 857 358 878.5 355L900 352L900 287L878.5 285.5C857 284 814 281 771.2 276.5C728.3 272 685.7 266 642.8 263C600 260 557 260 514.2 264.5C471.3 269 428.7 278 385.8 284C343 290 300 293 257.2 296C214.3 299 171.7 302 128.8 305C86 308 43 311 21.5 312.5L0 314Z" fill="#b07068"></path><path d="M0 433L21.5 430C43 427 86 421 128.8 421C171.7 421 214.3 427 257.2 427C300 427 343 421 385.8 418C428.7 415 471.3 415 514.2 412C557 409 600 403 642.8 404.5C685.7 406 728.3 415 771.2 413.5C814 412 857 400 878.5 394L900 388L900 350L878.5 353C857 356 814 362 771.2 359C728.3 356 685.7 344 642.8 341C600 338 557 344 514.2 350C471.3 356 428.7 362 385.8 366.5C343 371 300 374 257.2 375.5C214.3 377 171.7 377 128.8 378.5C86 380 43 383 21.5 384.5L0 386Z" fill="#bd8372"></path><path d="M0 496L21.5 490C43 484 86 472 128.8 467.5C171.7 463 214.3 466 257.2 466C300 466 343 463 385.8 463C428.7 463 471.3 466 514.2 466C557 466 600 463 642.8 466C685.7 469 728.3 478 771.2 476.5C814 475 857 463 878.5 457L900 451L900 386L878.5 392C857 398 814 410 771.2 411.5C728.3 413 685.7 404 642.8 402.5C600 401 557 407 514.2 410C471.3 413 428.7 413 385.8 416C343 419 300 425 257.2 425C214.3 425 171.7 419 128.8 419C86 419 43 425 21.5 428L0 431Z" fill="#c9977e"></path><path d="M0 640L21.5 644.5C43 649 86 658 128.8 658C171.7 658 214.3 649 257.2 649C300 649 343 658 385.8 659.5C428.7 661 471.3 655 514.2 649C557 643 600 637 642.8 644.5C685.7 652 728.3 673 771.2 673C814 673 857 652 878.5 641.5L900 631L900 449L878.5 455C857 461 814 473 771.2 474.5C728.3 476 685.7 467 642.8 464C600 461 557 464 514.2 464C471.3 464 428.7 461 385.8 461C343 461 300 464 257.2 464C214.3 464 171.7 461 128.8 465.5C86 470 43 482 21.5 488L0 494Z" fill="#d3ab8d"></path><path d="M0 703L21.5 715C43 727 86 751 128.8 754C171.7 757 214.3 739 257.2 736C300 733 343 745 385.8 743.5C428.7 742 471.3 727 514.2 718C557 709 600 706 642.8 713.5C685.7 721 728.3 739 771.2 743.5C814 748 857 739 878.5 734.5L900 730L900 629L878.5 639.5C857 650 814 671 771.2 671C728.3 671 685.7 650 642.8 642.5C600 635 557 641 514.2 647C471.3 653 428.7 659 385.8 657.5C343 656 300 647 257.2 647C214.3 647 171.7 656 128.8 656C86 656 43 647 21.5 642.5L0 638Z" fill="#dec09d"></path><path d="M0 901L21.5 901C43 901 86 901 128.8 901C171.7 901 214.3 901 257.2 901C300 901 343 901 385.8 901C428.7 901 471.3 901 514.2 901C557 901 600 901 642.8 901C685.7 901 728.3 901 771.2 901C814 901 857 901 878.5 901L900 901L900 728L878.5 732.5C857 737 814 746 771.2 741.5C728.3 737 685.7 719 642.8 711.5C600 704 557 707 514.2 716C471.3 725 428.7 740 385.8 741.5C343 743 300 731 257.2 734C214.3 737 171.7 755 128.8 752C86 749 43 725 21.5 713L0 701Z" fill="#e8d4b0"></path></svg>
        )
    }
    const svg1 = () => {
        return (
            <svg id="visual" viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1"><path d="M0 109L21.5 104.5C43 100 86 91 128.8 91C171.7 91 214.3 100 257.2 103C300 106 343 103 385.8 98.5C428.7 94 471.3 88 514.2 94C557 100 600 118 642.8 127C685.7 136 728.3 136 771.2 125.5C814 115 857 94 878.5 83.5L900 73L900 0L878.5 0C857 0 814 0 771.2 0C728.3 0 685.7 0 642.8 0C600 0 557 0 514.2 0C471.3 0 428.7 0 385.8 0C343 0 300 0 257.2 0C214.3 0 171.7 0 128.8 0C86 0 43 0 21.5 0L0 0Z" fill="#591c4a"></path><path d="M0 172L21.5 169C43 166 86 160 128.8 158.5C171.7 157 214.3 160 257.2 163C300 166 343 169 385.8 169C428.7 169 471.3 166 514.2 170.5C557 175 600 187 642.8 191.5C685.7 196 728.3 193 771.2 182.5C814 172 857 154 878.5 145L900 136L900 71L878.5 81.5C857 92 814 113 771.2 123.5C728.3 134 685.7 134 642.8 125C600 116 557 98 514.2 92C471.3 86 428.7 92 385.8 96.5C343 101 300 104 257.2 101C214.3 98 171.7 89 128.8 89C86 89 43 98 21.5 102.5L0 107Z" fill="#6e2a4f"></path><path d="M0 208L21.5 206.5C43 205 86 202 128.8 200.5C171.7 199 214.3 199 257.2 202C300 205 343 211 385.8 211C428.7 211 471.3 205 514.2 212.5C557 220 600 241 642.8 250C685.7 259 728.3 256 771.2 241C814 226 857 199 878.5 185.5L900 172L900 134L878.5 143C857 152 814 170 771.2 180.5C728.3 191 685.7 194 642.8 189.5C600 185 557 173 514.2 168.5C471.3 164 428.7 167 385.8 167C343 167 300 164 257.2 161C214.3 158 171.7 155 128.8 156.5C86 158 43 164 21.5 167L0 170Z" fill="#813a54"></path><path d="M0 244L21.5 245.5C43 247 86 250 128.8 248.5C171.7 247 214.3 241 257.2 239.5C300 238 343 241 385.8 241C428.7 241 471.3 238 514.2 247C557 256 600 277 642.8 286C685.7 295 728.3 292 771.2 278.5C814 265 857 241 878.5 229L900 217L900 170L878.5 183.5C857 197 814 224 771.2 239C728.3 254 685.7 257 642.8 248C600 239 557 218 514.2 210.5C471.3 203 428.7 209 385.8 209C343 209 300 203 257.2 200C214.3 197 171.7 197 128.8 198.5C86 200 43 203 21.5 204.5L0 206Z" fill="#924b59"></path><path d="M0 307L21.5 316C43 325 86 343 128.8 343C171.7 343 214.3 325 257.2 320.5C300 316 343 325 385.8 328C428.7 331 471.3 328 514.2 334C557 340 600 355 642.8 362.5C685.7 370 728.3 370 771.2 362.5C814 355 857 340 878.5 332.5L900 325L900 215L878.5 227C857 239 814 263 771.2 276.5C728.3 290 685.7 293 642.8 284C600 275 557 254 514.2 245C471.3 236 428.7 239 385.8 239C343 239 300 236 257.2 237.5C214.3 239 171.7 245 128.8 246.5C86 248 43 245 21.5 243.5L0 242Z" fill="#a25d60"></path><path d="M0 541L21.5 551.5C43 562 86 583 128.8 586C171.7 589 214.3 574 257.2 562C300 550 343 541 385.8 529C428.7 517 471.3 502 514.2 508C557 514 600 541 642.8 545.5C685.7 550 728.3 532 771.2 529C814 526 857 538 878.5 544L900 550L900 323L878.5 330.5C857 338 814 353 771.2 360.5C728.3 368 685.7 368 642.8 360.5C600 353 557 338 514.2 332C471.3 326 428.7 329 385.8 326C343 323 300 314 257.2 318.5C214.3 323 171.7 341 128.8 341C86 341 43 323 21.5 314L0 305Z" fill="#b07068"></path><path d="M0 577L21.5 586C43 595 86 613 128.8 617.5C171.7 622 214.3 613 257.2 604C300 595 343 586 385.8 572.5C428.7 559 471.3 541 514.2 544C557 547 600 571 642.8 577C685.7 583 728.3 571 771.2 568C814 565 857 571 878.5 574L900 577L900 548L878.5 542C857 536 814 524 771.2 527C728.3 530 685.7 548 642.8 543.5C600 539 557 512 514.2 506C471.3 500 428.7 515 385.8 527C343 539 300 548 257.2 560C214.3 572 171.7 587 128.8 584C86 581 43 560 21.5 549.5L0 539Z" fill="#bd8372"></path><path d="M0 631L21.5 638.5C43 646 86 661 128.8 662.5C171.7 664 214.3 652 257.2 644.5C300 637 343 634 385.8 620.5C428.7 607 471.3 583 514.2 584.5C557 586 600 613 642.8 619C685.7 625 728.3 610 771.2 608.5C814 607 857 619 878.5 625L900 631L900 575L878.5 572C857 569 814 563 771.2 566C728.3 569 685.7 581 642.8 575C600 569 557 545 514.2 542C471.3 539 428.7 557 385.8 570.5C343 584 300 593 257.2 602C214.3 611 171.7 620 128.8 615.5C86 611 43 593 21.5 584L0 575Z" fill="#c9977e"></path><path d="M0 694L21.5 700C43 706 86 718 128.8 721C171.7 724 214.3 718 257.2 710.5C300 703 343 694 385.8 679C428.7 664 471.3 643 514.2 646C557 649 600 676 642.8 682C685.7 688 728.3 673 771.2 670C814 667 857 676 878.5 680.5L900 685L900 629L878.5 623C857 617 814 605 771.2 606.5C728.3 608 685.7 623 642.8 617C600 611 557 584 514.2 582.5C471.3 581 428.7 605 385.8 618.5C343 632 300 635 257.2 642.5C214.3 650 171.7 662 128.8 660.5C86 659 43 644 21.5 636.5L0 629Z" fill="#d3ab8d"></path><path d="M0 739L21.5 745C43 751 86 763 128.8 764.5C171.7 766 214.3 757 257.2 749.5C300 742 343 736 385.8 721C428.7 706 471.3 682 514.2 688C557 694 600 730 642.8 739C685.7 748 728.3 730 771.2 727C814 724 857 736 878.5 742L900 748L900 683L878.5 678.5C857 674 814 665 771.2 668C728.3 671 685.7 686 642.8 680C600 674 557 647 514.2 644C471.3 641 428.7 662 385.8 677C343 692 300 701 257.2 708.5C214.3 716 171.7 722 128.8 719C86 716 43 704 21.5 698L0 692Z" fill="#dec09d"></path><path d="M0 901L21.5 901C43 901 86 901 128.8 901C171.7 901 214.3 901 257.2 901C300 901 343 901 385.8 901C428.7 901 471.3 901 514.2 901C557 901 600 901 642.8 901C685.7 901 728.3 901 771.2 901C814 901 857 901 878.5 901L900 901L900 746L878.5 740C857 734 814 722 771.2 725C728.3 728 685.7 746 642.8 737C600 728 557 692 514.2 686C471.3 680 428.7 704 385.8 719C343 734 300 740 257.2 747.5C214.3 755 171.7 764 128.8 762.5C86 761 43 749 21.5 743L0 737Z" fill="#e8d4b0"></path></svg>
        )
    }
    const svg2 = () => {
        return (
            <svg id="visual" viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1"><path d="M0 46L21.5 46C43 46 86 46 128.8 47.5C171.7 49 214.3 52 257.2 52C300 52 343 49 385.8 46C428.7 43 471.3 40 514.2 41.5C557 43 600 49 642.8 52C685.7 55 728.3 55 771.2 55C814 55 857 55 878.5 55L900 55L900 0L878.5 0C857 0 814 0 771.2 0C728.3 0 685.7 0 642.8 0C600 0 557 0 514.2 0C471.3 0 428.7 0 385.8 0C343 0 300 0 257.2 0C214.3 0 171.7 0 128.8 0C86 0 43 0 21.5 0L0 0Z" fill="#591c4a"></path><path d="M0 82L21.5 85C43 88 86 94 128.8 94C171.7 94 214.3 88 257.2 88C300 88 343 94 385.8 91C428.7 88 471.3 76 514.2 74.5C557 73 600 82 642.8 89.5C685.7 97 728.3 103 771.2 104.5C814 106 857 103 878.5 101.5L900 100L900 53L878.5 53C857 53 814 53 771.2 53C728.3 53 685.7 53 642.8 50C600 47 557 41 514.2 39.5C471.3 38 428.7 41 385.8 44C343 47 300 50 257.2 50C214.3 50 171.7 47 128.8 45.5C86 44 43 44 21.5 44L0 44Z" fill="#6e2a4f"></path><path d="M0 298L21.5 308.5C43 319 86 340 128.8 340C171.7 340 214.3 319 257.2 304C300 289 343 280 385.8 281.5C428.7 283 471.3 295 514.2 293.5C557 292 600 277 642.8 271C685.7 265 728.3 268 771.2 274C814 280 857 289 878.5 293.5L900 298L900 98L878.5 99.5C857 101 814 104 771.2 102.5C728.3 101 685.7 95 642.8 87.5C600 80 557 71 514.2 72.5C471.3 74 428.7 86 385.8 89C343 92 300 86 257.2 86C214.3 86 171.7 92 128.8 92C86 92 43 86 21.5 83L0 80Z" fill="#813a54"></path><path d="M0 433L21.5 436C43 439 86 445 128.8 439C171.7 433 214.3 415 257.2 404.5C300 394 343 391 385.8 394C428.7 397 471.3 406 514.2 406C557 406 600 397 642.8 392.5C685.7 388 728.3 388 771.2 392.5C814 397 857 406 878.5 410.5L900 415L900 296L878.5 291.5C857 287 814 278 771.2 272C728.3 266 685.7 263 642.8 269C600 275 557 290 514.2 291.5C471.3 293 428.7 281 385.8 279.5C343 278 300 287 257.2 302C214.3 317 171.7 338 128.8 338C86 338 43 317 21.5 306.5L0 296Z" fill="#924b59"></path><path d="M0 487L21.5 488.5C43 490 86 493 128.8 488.5C171.7 484 214.3 472 257.2 461.5C300 451 343 442 385.8 443.5C428.7 445 471.3 457 514.2 461.5C557 466 600 463 642.8 458.5C685.7 454 728.3 448 771.2 449.5C814 451 857 460 878.5 464.5L900 469L900 413L878.5 408.5C857 404 814 395 771.2 390.5C728.3 386 685.7 386 642.8 390.5C600 395 557 404 514.2 404C471.3 404 428.7 395 385.8 392C343 389 300 392 257.2 402.5C214.3 413 171.7 431 128.8 437C86 443 43 437 21.5 434L0 431Z" fill="#a25d60"></path><path d="M0 514L21.5 518.5C43 523 86 532 128.8 530.5C171.7 529 214.3 517 257.2 505C300 493 343 481 385.8 482.5C428.7 484 471.3 499 514.2 503.5C557 508 600 502 642.8 496C685.7 490 728.3 484 771.2 484C814 484 857 490 878.5 493L900 496L900 467L878.5 462.5C857 458 814 449 771.2 447.5C728.3 446 685.7 452 642.8 456.5C600 461 557 464 514.2 459.5C471.3 455 428.7 443 385.8 441.5C343 440 300 449 257.2 459.5C214.3 470 171.7 482 128.8 486.5C86 491 43 488 21.5 486.5L0 485Z" fill="#b07068"></path><path d="M0 586L21.5 589C43 592 86 598 128.8 592C171.7 586 214.3 568 257.2 559C300 550 343 550 385.8 554.5C428.7 559 471.3 568 514.2 572.5C557 577 600 577 642.8 571C685.7 565 728.3 553 771.2 550C814 547 857 553 878.5 556L900 559L900 494L878.5 491C857 488 814 482 771.2 482C728.3 482 685.7 488 642.8 494C600 500 557 506 514.2 501.5C471.3 497 428.7 482 385.8 480.5C343 479 300 491 257.2 503C214.3 515 171.7 527 128.8 528.5C86 530 43 521 21.5 516.5L0 512Z" fill="#bd8372"></path><path d="M0 640L21.5 638.5C43 637 86 634 128.8 626.5C171.7 619 214.3 607 257.2 598C300 589 343 583 385.8 586C428.7 589 471.3 601 514.2 605.5C557 610 600 607 642.8 601C685.7 595 728.3 586 771.2 586C814 586 857 595 878.5 599.5L900 604L900 557L878.5 554C857 551 814 545 771.2 548C728.3 551 685.7 563 642.8 569C600 575 557 575 514.2 570.5C471.3 566 428.7 557 385.8 552.5C343 548 300 548 257.2 557C214.3 566 171.7 584 128.8 590C86 596 43 590 21.5 587L0 584Z" fill="#c9977e"></path><path d="M0 784L21.5 787C43 790 86 796 128.8 793C171.7 790 214.3 778 257.2 773.5C300 769 343 772 385.8 776.5C428.7 781 471.3 787 514.2 781C557 775 600 757 642.8 754C685.7 751 728.3 763 771.2 764.5C814 766 857 757 878.5 752.5L900 748L900 602L878.5 597.5C857 593 814 584 771.2 584C728.3 584 685.7 593 642.8 599C600 605 557 608 514.2 603.5C471.3 599 428.7 587 385.8 584C343 581 300 587 257.2 596C214.3 605 171.7 617 128.8 624.5C86 632 43 635 21.5 636.5L0 638Z" fill="#d3ab8d"></path><path d="M0 838L21.5 838C43 838 86 838 128.8 836.5C171.7 835 214.3 832 257.2 827.5C300 823 343 817 385.8 817C428.7 817 471.3 823 514.2 821.5C557 820 600 811 642.8 812.5C685.7 814 728.3 826 771.2 826C814 826 857 814 878.5 808L900 802L900 746L878.5 750.5C857 755 814 764 771.2 762.5C728.3 761 685.7 749 642.8 752C600 755 557 773 514.2 779C471.3 785 428.7 779 385.8 774.5C343 770 300 767 257.2 771.5C214.3 776 171.7 788 128.8 791C86 794 43 788 21.5 785L0 782Z" fill="#dec09d"></path><path d="M0 901L21.5 901C43 901 86 901 128.8 901C171.7 901 214.3 901 257.2 901C300 901 343 901 385.8 901C428.7 901 471.3 901 514.2 901C557 901 600 901 642.8 901C685.7 901 728.3 901 771.2 901C814 901 857 901 878.5 901L900 901L900 800L878.5 806C857 812 814 824 771.2 824C728.3 824 685.7 812 642.8 810.5C600 809 557 818 514.2 819.5C471.3 821 428.7 815 385.8 815C343 815 300 821 257.2 825.5C214.3 830 171.7 833 128.8 834.5C86 836 43 836 21.5 836L0 836Z" fill="#e8d4b0"></path></svg>
        )
    }
    const svg3 = () => {
        return (
            <svg id="visual" viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1"><path d="M0 172L21.5 166C43 160 86 148 128.8 154C171.7 160 214.3 184 257.2 190C300 196 343 184 385.8 181C428.7 178 471.3 184 514.2 194.5C557 205 600 220 642.8 217C685.7 214 728.3 193 771.2 187C814 181 857 190 878.5 194.5L900 199L900 0L878.5 0C857 0 814 0 771.2 0C728.3 0 685.7 0 642.8 0C600 0 557 0 514.2 0C471.3 0 428.7 0 385.8 0C343 0 300 0 257.2 0C214.3 0 171.7 0 128.8 0C86 0 43 0 21.5 0L0 0Z" fill="#591c4a"></path><path d="M0 253L21.5 245.5C43 238 86 223 128.8 224.5C171.7 226 214.3 244 257.2 247C300 250 343 238 385.8 233.5C428.7 229 471.3 232 514.2 242.5C557 253 600 271 642.8 268C685.7 265 728.3 241 771.2 238C814 235 857 253 878.5 262L900 271L900 197L878.5 192.5C857 188 814 179 771.2 185C728.3 191 685.7 212 642.8 215C600 218 557 203 514.2 192.5C471.3 182 428.7 176 385.8 179C343 182 300 194 257.2 188C214.3 182 171.7 158 128.8 152C86 146 43 158 21.5 164L0 170Z" fill="#6e2a4f"></path><path d="M0 316L21.5 307C43 298 86 280 128.8 277C171.7 274 214.3 286 257.2 287.5C300 289 343 280 385.8 280C428.7 280 471.3 289 514.2 302.5C557 316 600 334 642.8 329.5C685.7 325 728.3 298 771.2 295C814 292 857 313 878.5 323.5L900 334L900 269L878.5 260C857 251 814 233 771.2 236C728.3 239 685.7 263 642.8 266C600 269 557 251 514.2 240.5C471.3 230 428.7 227 385.8 231.5C343 236 300 248 257.2 245C214.3 242 171.7 224 128.8 222.5C86 221 43 236 21.5 243.5L0 251Z" fill="#813a54"></path><path d="M0 352L21.5 343C43 334 86 316 128.8 314.5C171.7 313 214.3 328 257.2 329.5C300 331 343 319 385.8 319C428.7 319 471.3 331 514.2 344.5C557 358 600 373 642.8 367C685.7 361 728.3 334 771.2 331C814 328 857 349 878.5 359.5L900 370L900 332L878.5 321.5C857 311 814 290 771.2 293C728.3 296 685.7 323 642.8 327.5C600 332 557 314 514.2 300.5C471.3 287 428.7 278 385.8 278C343 278 300 287 257.2 285.5C214.3 284 171.7 272 128.8 275C86 278 43 296 21.5 305L0 314Z" fill="#924b59"></path><path d="M0 397L21.5 391C43 385 86 373 128.8 370C171.7 367 214.3 373 257.2 373C300 373 343 367 385.8 367C428.7 367 471.3 373 514.2 386.5C557 400 600 421 642.8 419.5C685.7 418 728.3 394 771.2 388C814 382 857 394 878.5 400L900 406L900 368L878.5 357.5C857 347 814 326 771.2 329C728.3 332 685.7 359 642.8 365C600 371 557 356 514.2 342.5C471.3 329 428.7 317 385.8 317C343 317 300 329 257.2 327.5C214.3 326 171.7 311 128.8 312.5C86 314 43 332 21.5 341L0 350Z" fill="#a25d60"></path><path d="M0 469L21.5 460C43 451 86 433 128.8 430C171.7 427 214.3 439 257.2 443.5C300 448 343 445 385.8 448C428.7 451 471.3 460 514.2 467.5C557 475 600 481 642.8 475C685.7 469 728.3 451 771.2 448C814 445 857 457 878.5 463L900 469L900 404L878.5 398C857 392 814 380 771.2 386C728.3 392 685.7 416 642.8 417.5C600 419 557 398 514.2 384.5C471.3 371 428.7 365 385.8 365C343 365 300 371 257.2 371C214.3 371 171.7 365 128.8 368C86 371 43 383 21.5 389L0 395Z" fill="#b07068"></path><path d="M0 496L21.5 490C43 484 86 472 128.8 472C171.7 472 214.3 484 257.2 485.5C300 487 343 478 385.8 478C428.7 478 471.3 487 514.2 496C557 505 600 514 642.8 508C685.7 502 728.3 481 771.2 478C814 475 857 490 878.5 497.5L900 505L900 467L878.5 461C857 455 814 443 771.2 446C728.3 449 685.7 467 642.8 473C600 479 557 473 514.2 465.5C471.3 458 428.7 449 385.8 446C343 443 300 446 257.2 441.5C214.3 437 171.7 425 128.8 428C86 431 43 449 21.5 458L0 467Z" fill="#bd8372"></path><path d="M0 532L21.5 526C43 520 86 508 128.8 511C171.7 514 214.3 532 257.2 536.5C300 541 343 532 385.8 532C428.7 532 471.3 541 514.2 548.5C557 556 600 562 642.8 553C685.7 544 728.3 520 771.2 517C814 514 857 532 878.5 541L900 550L900 503L878.5 495.5C857 488 814 473 771.2 476C728.3 479 685.7 500 642.8 506C600 512 557 503 514.2 494C471.3 485 428.7 476 385.8 476C343 476 300 485 257.2 483.5C214.3 482 171.7 470 128.8 470C86 470 43 482 21.5 488L0 494Z" fill="#c9977e"></path><path d="M0 622L21.5 619C43 616 86 610 128.8 610C171.7 610 214.3 616 257.2 613C300 610 343 598 385.8 601C428.7 604 471.3 622 514.2 637C557 652 600 664 642.8 656.5C685.7 649 728.3 622 771.2 614.5C814 607 857 619 878.5 625L900 631L900 548L878.5 539C857 530 814 512 771.2 515C728.3 518 685.7 542 642.8 551C600 560 557 554 514.2 546.5C471.3 539 428.7 530 385.8 530C343 530 300 539 257.2 534.5C214.3 530 171.7 512 128.8 509C86 506 43 518 21.5 524L0 530Z" fill="#d3ab8d"></path><path d="M0 829L21.5 829C43 829 86 829 128.8 818.5C171.7 808 214.3 787 257.2 782.5C300 778 343 790 385.8 793C428.7 796 471.3 790 514.2 791.5C557 793 600 802 642.8 806.5C685.7 811 728.3 811 771.2 811C814 811 857 811 878.5 811L900 811L900 629L878.5 623C857 617 814 605 771.2 612.5C728.3 620 685.7 647 642.8 654.5C600 662 557 650 514.2 635C471.3 620 428.7 602 385.8 599C343 596 300 608 257.2 611C214.3 614 171.7 608 128.8 608C86 608 43 614 21.5 617L0 620Z" fill="#dec09d"></path><path d="M0 901L21.5 901C43 901 86 901 128.8 901C171.7 901 214.3 901 257.2 901C300 901 343 901 385.8 901C428.7 901 471.3 901 514.2 901C557 901 600 901 642.8 901C685.7 901 728.3 901 771.2 901C814 901 857 901 878.5 901L900 901L900 809L878.5 809C857 809 814 809 771.2 809C728.3 809 685.7 809 642.8 804.5C600 800 557 791 514.2 789.5C471.3 788 428.7 794 385.8 791C343 788 300 776 257.2 780.5C214.3 785 171.7 806 128.8 816.5C86 827 43 827 21.5 827L0 827Z" fill="#e8d4b0"></path></svg>
        )
    }
    const svg4 = () => {
        return (
            <svg id="visual" viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1"><path d="M0 73L21.5 74.5C43 76 86 79 128.8 82C171.7 85 214.3 88 257.2 85C300 82 343 73 385.8 74.5C428.7 76 471.3 88 514.2 89.5C557 91 600 82 642.8 76C685.7 70 728.3 67 771.2 67C814 67 857 70 878.5 71.5L900 73L900 0L878.5 0C857 0 814 0 771.2 0C728.3 0 685.7 0 642.8 0C600 0 557 0 514.2 0C471.3 0 428.7 0 385.8 0C343 0 300 0 257.2 0C214.3 0 171.7 0 128.8 0C86 0 43 0 21.5 0L0 0Z" fill="#591c4a"></path><path d="M0 226L21.5 227.5C43 229 86 232 128.8 235C171.7 238 214.3 241 257.2 251.5C300 262 343 280 385.8 281.5C428.7 283 471.3 268 514.2 262C557 256 600 259 642.8 251.5C685.7 244 728.3 226 771.2 223C814 220 857 232 878.5 238L900 244L900 71L878.5 69.5C857 68 814 65 771.2 65C728.3 65 685.7 68 642.8 74C600 80 557 89 514.2 87.5C471.3 86 428.7 74 385.8 72.5C343 71 300 80 257.2 83C214.3 86 171.7 83 128.8 80C86 77 43 74 21.5 72.5L0 71Z" fill="#6e2a4f"></path><path d="M0 352L21.5 356.5C43 361 86 370 128.8 373C171.7 376 214.3 373 257.2 377.5C300 382 343 394 385.8 392.5C428.7 391 471.3 376 514.2 373C557 370 600 379 642.8 367C685.7 355 728.3 322 771.2 317.5C814 313 857 337 878.5 349L900 361L900 242L878.5 236C857 230 814 218 771.2 221C728.3 224 685.7 242 642.8 249.5C600 257 557 254 514.2 260C471.3 266 428.7 281 385.8 279.5C343 278 300 260 257.2 249.5C214.3 239 171.7 236 128.8 233C86 230 43 227 21.5 225.5L0 224Z" fill="#813a54"></path><path d="M0 406L21.5 409C43 412 86 418 128.8 422.5C171.7 427 214.3 430 257.2 436C300 442 343 451 385.8 448C428.7 445 471.3 430 514.2 428.5C557 427 600 439 642.8 427C685.7 415 728.3 379 771.2 371.5C814 364 857 385 878.5 395.5L900 406L900 359L878.5 347C857 335 814 311 771.2 315.5C728.3 320 685.7 353 642.8 365C600 377 557 368 514.2 371C471.3 374 428.7 389 385.8 390.5C343 392 300 380 257.2 375.5C214.3 371 171.7 374 128.8 371C86 368 43 359 21.5 354.5L0 350Z" fill="#924b59"></path><path d="M0 451L21.5 452.5C43 454 86 457 128.8 463C171.7 469 214.3 478 257.2 484C300 490 343 493 385.8 488.5C428.7 484 471.3 472 514.2 472C557 472 600 484 642.8 472C685.7 460 728.3 424 771.2 416.5C814 409 857 430 878.5 440.5L900 451L900 404L878.5 393.5C857 383 814 362 771.2 369.5C728.3 377 685.7 413 642.8 425C600 437 557 425 514.2 426.5C471.3 428 428.7 443 385.8 446C343 449 300 440 257.2 434C214.3 428 171.7 425 128.8 420.5C86 416 43 410 21.5 407L0 404Z" fill="#a25d60"></path><path d="M0 514L21.5 520C43 526 86 538 128.8 541C171.7 544 214.3 538 257.2 541C300 544 343 556 385.8 557.5C428.7 559 471.3 550 514.2 547C557 544 600 547 642.8 536.5C685.7 526 728.3 502 771.2 494.5C814 487 857 496 878.5 500.5L900 505L900 449L878.5 438.5C857 428 814 407 771.2 414.5C728.3 422 685.7 458 642.8 470C600 482 557 470 514.2 470C471.3 470 428.7 482 385.8 486.5C343 491 300 488 257.2 482C214.3 476 171.7 467 128.8 461C86 455 43 452 21.5 450.5L0 449Z" fill="#b07068"></path><path d="M0 550L21.5 556C43 562 86 574 128.8 575.5C171.7 577 214.3 568 257.2 572.5C300 577 343 595 385.8 598C428.7 601 471.3 589 514.2 583C557 577 600 577 642.8 566.5C685.7 556 728.3 535 771.2 530.5C814 526 857 538 878.5 544L900 550L900 503L878.5 498.5C857 494 814 485 771.2 492.5C728.3 500 685.7 524 642.8 534.5C600 545 557 542 514.2 545C471.3 548 428.7 557 385.8 555.5C343 554 300 542 257.2 539C214.3 536 171.7 542 128.8 539C86 536 43 524 21.5 518L0 512Z" fill="#bd8372"></path><path d="M0 604L21.5 607C43 610 86 616 128.8 617.5C171.7 619 214.3 616 257.2 620.5C300 625 343 637 385.8 638.5C428.7 640 471.3 631 514.2 628C557 625 600 628 642.8 619C685.7 610 728.3 589 771.2 584.5C814 580 857 592 878.5 598L900 604L900 548L878.5 542C857 536 814 524 771.2 528.5C728.3 533 685.7 554 642.8 564.5C600 575 557 575 514.2 581C471.3 587 428.7 599 385.8 596C343 593 300 575 257.2 570.5C214.3 566 171.7 575 128.8 573.5C86 572 43 560 21.5 554L0 548Z" fill="#c9977e"></path><path d="M0 676L21.5 676C43 676 86 676 128.8 677.5C171.7 679 214.3 682 257.2 685C300 688 343 691 385.8 689.5C428.7 688 471.3 682 514.2 682C557 682 600 688 642.8 682C685.7 676 728.3 658 771.2 655C814 652 857 664 878.5 670L900 676L900 602L878.5 596C857 590 814 578 771.2 582.5C728.3 587 685.7 608 642.8 617C600 626 557 623 514.2 626C471.3 629 428.7 638 385.8 636.5C343 635 300 623 257.2 618.5C214.3 614 171.7 617 128.8 615.5C86 614 43 608 21.5 605L0 602Z" fill="#d3ab8d"></path><path d="M0 874L21.5 872.5C43 871 86 868 128.8 868C171.7 868 214.3 871 257.2 872.5C300 874 343 874 385.8 872.5C428.7 871 471.3 868 514.2 868C557 868 600 871 642.8 872.5C685.7 874 728.3 874 771.2 874C814 874 857 874 878.5 874L900 874L900 674L878.5 668C857 662 814 650 771.2 653C728.3 656 685.7 674 642.8 680C600 686 557 680 514.2 680C471.3 680 428.7 686 385.8 687.5C343 689 300 686 257.2 683C214.3 680 171.7 677 128.8 675.5C86 674 43 674 21.5 674L0 674Z" fill="#dec09d"></path><path d="M0 901L21.5 901C43 901 86 901 128.8 901C171.7 901 214.3 901 257.2 901C300 901 343 901 385.8 901C428.7 901 471.3 901 514.2 901C557 901 600 901 642.8 901C685.7 901 728.3 901 771.2 901C814 901 857 901 878.5 901L900 901L900 872L878.5 872C857 872 814 872 771.2 872C728.3 872 685.7 872 642.8 870.5C600 869 557 866 514.2 866C471.3 866 428.7 869 385.8 870.5C343 872 300 872 257.2 870.5C214.3 869 171.7 866 128.8 866C86 866 43 869 21.5 870.5L0 872Z" fill="#e8d4b0"></path></svg>
        )
    }

    const [svg, setSvg] = useState<(() => JSX.Element)>(svg0)
    const [prevIndex, setPrevIndex] = useState(-1)


    let svgArray = [svg0, svg1, svg2, svg3, svg4]

    useEffect(() => {

        const intervalId = setInterval(() => {

            let randomIndex = prevIndex;
            while (randomIndex === prevIndex) {
                randomIndex = Math.floor(Math.random() * svgArray.length);
            }
            console.log(randomIndex);
            setPrevIndex(randomIndex);
            setSvg(svgArray[randomIndex]);

            // const randomIndex = Math.floor(Math.random() * svgArray.length);
            // setSvg(svgArray[randomIndex])
            // const getRandomSvg = () => {
            //     return svgArray[randomIndex];
            //   };
      
          }, interval)
      
          return () => clearInterval(intervalId)


    }, [])


  return (
    <div className={className}>
    {svg&& svg}
    </div>
  )
}

export default SvgArray