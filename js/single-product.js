// Wait for the document to be fully loaded before running scripts
    $(function() {

        // === PART 1: DONATION FORM SCRIPT (jQuery Version) ===
        const $singleBtn = $('#singleBtn');
        const $monthlyBtn = $('#monthlyBtn');
        const $amountButtons = $('.donation-form-amount-btn');
        const $customAmountInput = $('#customAmountInput');
        
        function updateFrequencyButtons($activeBtn, $inactiveBtn) {
            $activeBtn.addClass('bg-brand-dark text-white').removeClass('text-brand-text-medium');
            $inactiveBtn.removeClass('bg-brand-dark text-white').addClass('text-brand-text-medium');
        }

        function updateAmountButtonStyles(selectedButtonValue) {
            $amountButtons.removeClass('bg-brand-dark text-white').addClass('bg-gray-100 text-brand-dark border border-gray-200');
            $amountButtons.each(function() {
                const $btn = $(this);
                const btnValue = $btn.data('amount');
                if (String(btnValue) === String(selectedButtonValue)) {
                    $btn.addClass('bg-brand-dark text-white').removeClass('bg-gray-100 text-brand-dark border border-gray-200');
                }
            });
        }

        if($singleBtn.length && $monthlyBtn.length) {
            $singleBtn.on('click', () => updateFrequencyButtons($singleBtn, $monthlyBtn));
            $monthlyBtn.on('click', () => updateFrequencyButtons($monthlyBtn, $singleBtn));
            updateFrequencyButtons($singleBtn, $monthlyBtn); // Initial state
        }

        $amountButtons.on('click', function() {
            const selectedAmount = $(this).data('amount');
            $customAmountInput.val(selectedAmount);
            updateAmountButtonStyles(selectedAmount);
        });

        if($customAmountInput.length){
            $customAmountInput.on('input', function() {
                const currentValue = $(this).val();
                let matchedButtonDataAmount = null;
                $amountButtons.each(function() {
                    if ($(this).data('amount').toString() === currentValue) {
                        matchedButtonDataAmount = $(this).data('amount');
                    }
                });
                updateAmountButtonStyles(matchedButtonDataAmount);
            });
            
            // Sync on load
            if ($customAmountInput.val()) {
                updateAmountButtonStyles($customAmountInput.val());
            } else {
                 updateAmountButtonStyles("250");
            }
        } else {
             updateAmountButtonStyles("250");
        }
        

        // === PART 2: IMAGE SLIDER SCRIPT (DYNAMIC WORDPRESS VERSION) ===
        const $featuredImage = $('#featuredImage');
        const $thumbnailContainer = $('#thumbnailContainer');
        let imageSliderInterval;

        // This function sets up the entire gallery.
        function initializeGallery() {
            const $thumbnails = $thumbnailContainer.find('.image-gallery-thumbnail-img');
            if (!$featuredImage.length || !$thumbnails.length) return; // Exit if gallery is not present

            let currentIndex = 0; // Default to the first image

            // Find the initially active thumbnail, if one is set in the HTML
            const $activeThumb = $thumbnails.filter('.is-active');
            if ($activeThumb.length > 0) {
                 // Set the featured image to the one marked 'is-active'
                $featuredImage.attr('src', $activeThumb.data('full-src'));
                $featuredImage.attr('alt', $activeThumb.attr('alt'));
                $thumbnails.removeClass('border-brand-teal').addClass('border-transparent');
                $activeThumb.addClass('border-brand-teal').removeClass('border-transparent');
                currentIndex = $thumbnails.index($activeThumb);
            } else {
                // Otherwise, default to the very first thumbnail
                const $firstThumb = $thumbnails.first();
                $featuredImage.attr('src', $firstThumb.data('full-src'));
                $featuredImage.attr('alt', $firstThumb.attr('alt'));
                $firstThumb.addClass('border-brand-teal').removeClass('border-transparent');
            }

            // Function to update the main image
            const updateImageSlider = (newIndex) => {
                const $thumb = $thumbnails.eq(newIndex);
                if (!$thumb.length) return;
                
                $featuredImage.css('opacity', '0');
                setTimeout(() => {
                    $featuredImage.attr('src', $thumb.data('full-src'));
                    $featuredImage.attr('alt', $thumb.attr('alt'));
                    $thumbnails.removeClass('border-brand-teal').addClass('border-transparent');
                    $thumb.addClass('border-brand-teal').removeClass('border-transparent');
                    $featuredImage.css('opacity', '1');
                }, 300);
                currentIndex = newIndex;
            };

            // Function to start the automatic slideshow
            const startImageSlider = () => {
                clearInterval(imageSliderInterval);
                imageSliderInterval = setInterval(() => {
                    let nextIndex = (currentIndex + 1) % $thumbnails.length;
                    updateImageSlider(nextIndex);
                }, 5000);
            };

            // Handle clicking on a thumbnail
            $thumbnails.on('click', function() {
                const clickedIndex = $(this).index();
                updateImageSlider(clickedIndex);
                startImageSlider(); 
            });
            
            startImageSlider(); // Start the auto-play
        }
        
        initializeGallery(); // Run the setup function


        // === PART 3: TESTIMONIAL CAROUSEL SCRIPT (jQuery Version) ===
        const $testimonialTrack = $('#testimonial-track');
        if ($testimonialTrack.children().length > 0) {
            const $nextBtn = $('#testimonial-next');
            const $prevBtn = $('#testimonial-prev');
            const $dotsNav = $('#testimonial-dots');
            const $cards = $testimonialTrack.children();
            let currentIndex = 0;
            
            const getCardsInView = () => $(window).width() >= 768 ? 3 : 1;
            
            const updateCarousel = () => {
                const cardsInView = getCardsInView();
                const totalCards = $cards.length;
                const cardWidth = $cards.first().outerWidth(true);
                
                let maxIndex = Math.max(0, totalCards - cardsInView);
                currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));

                const offset = -currentIndex * cardWidth;
                $testimonialTrack.css('transform', `translateX(${offset}px)`);
                
                $prevBtn.toggle(currentIndex > 0);
                $nextBtn.toggle(currentIndex < maxIndex);

                const totalPages = Math.max(1, totalCards - cardsInView + 1);

                if($dotsNav.children().length !== totalPages && totalPages > 0) {
                    $dotsNav.empty(); 
                    for (let i = 0; i < totalPages; i++) {
                        $('<button>')
                            .addClass('testimonial-dot w-3 h-3 rounded-full transition-all duration-300 bg-gray-300')
                            .attr('aria-label', `Go to slide ${i + 1}`)
                            .on('click', () => { 
                                currentIndex = i;
                                updateCarousel(); 
                            })
                            .appendTo($dotsNav);
                    }
                }
                
                $dotsNav.children().removeClass('bg-brand-teal w-5').addClass('bg-gray-300');
                $dotsNav.children().eq(currentIndex).addClass('bg-brand-teal w-5').removeClass('bg-gray-300');
            };

            $nextBtn.on('click', () => { 
                const cardsInView = getCardsInView();
                if (currentIndex < $cards.length - cardsInView) {
                    currentIndex++; 
                    updateCarousel(); 
                }
            });
            
            $prevBtn.on('click', () => { 
                if (currentIndex > 0) { 
                    currentIndex--; 
                    updateCarousel(); 
                }
            });
            
            $(window).on('resize', updateCarousel);
            updateCarousel(); 
        }

        // === PART 4: DYNAMIC TAB SECTION SCRIPT (jQuery Version) ===
        const $tabButtonsContainer = $('#tab-buttons-container');
        if ($tabButtonsContainer.length) {
            $tabButtonsContainer.on('click', '.tab-btn', function() {
                const $clickedButton = $(this);
                const tabIdToShow = $clickedButton.data('tab-id');

                $('.tab-btn').removeClass('bg-brand-dark text-white shadow-md').addClass('bg-gray-100 text-brand-text-medium');
                $clickedButton.addClass('bg-brand-dark text-white shadow-md').removeClass('bg-gray-100 text-brand-text-medium');

                $('#tab-content-container > .tab-pane').addClass('hidden');
                $(`#tab-content-${tabIdToShow}`).removeClass('hidden');
            });
        }

        // === PART 5: FAQ ACCORDION SCRIPT (jQuery with Smooth slideToggle) ===
        $('#faq-accordion').on('click', '.faq-question', function() {
            const $this = $(this);
            const $parentItem = $this.closest('.faq-item');
            const $answer = $parentItem.find('.faq-answer-content');
            
            // Toggle the answer visibility for the clicked item
            $answer.slideToggle(300);
            
            // Add/remove 'active' class on the clicked item's text and parent
            $parentItem.toggleClass('active');
            $parentItem.find('.faq-question-text').toggleClass('active');
            
            // Close other open items
            $('.faq-answer-content').not($answer).slideUp(300);
            $('.faq-item').not($parentItem).removeClass('active');
            $('.faq-item').not($parentItem).find('.faq-question-text').removeClass('active');
        });


        // === PART 6: QURBAN COUNTDOWN TIMER SCRIPT (jQuery Version) ===
        function startQurbanCountdown() {
            const $daysEl = $('#countdown-days');
            const $hoursEl = $('#countdown-hours');
            const $minutesEl = $('#countdown-minutes');
            const $secondsEl = $('#countdown-seconds');
            const $progressFillEl = $('#qurban-progress-fill');
            const $percentageTextEl = $('#qurban-percentage-text');

            if (!$daysEl.length) return;

            const eidDate = new Date(2025, 5, 16, 0, 0, 0).getTime(); // June is 5 (0-indexed)
            const qurbanSpotsPercentage = 13; 
            
            $progressFillEl.css('width', `${qurbanSpotsPercentage}%`);
            $percentageTextEl.text(`${qurbanSpotsPercentage}%`);

            const updateCountdown = () => {
                const now = new Date().getTime();
                const distance = eidDate - now;

                if (distance < 0) {
                    $daysEl.text('00');
                    $hoursEl.text('00');
                    $minutesEl.text('00');
                    $secondsEl.text('00');
                    clearInterval(countdownInterval);
                    return;
                }

                const days = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
                const hours = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
                const minutes = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
                const seconds = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');

                $daysEl.text(days);
                $hoursEl.text(hours);
                $minutesEl.text(minutes);
                $secondsEl.text(seconds);
            };
            
            let countdownInterval = setInterval(updateCountdown, 1000);
            updateCountdown(); 
        }
        startQurbanCountdown();

    });