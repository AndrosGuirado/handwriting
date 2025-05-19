document.addEventListener("DOMContentLoaded", (event) => {
	gsap.registerPlugin(DrawSVGPlugin, SplitText)
	// -
	const SVGNS = "http://www.w3.org/2000/svg";

	// -
	const TEST = false;

	// -
	class WrittenChar {
		constructor(container, char, value, key, speed, delay, index, ease) {
			this.speed = speed || 200;
			this.delay = delay || 0;

			this.ease = ease || 'sine.in';
			// -
			this.container = container;
			this.char = char;
			this.value = value;
			this.key = key;
			this.index = index;
			// -
			this.originalSize = { w: this.value.w, h: this.value.h };
			this.strokeWidth = this.originalSize.h * 0.07;
			// -
			this.ratio = this.originalSize.w / this.originalSize.h;
			this.size = { w: this.container.clientHeight * this.ratio, h: this.container.clientHeight };
			this.init();
		}

		init() {
			this.svg = document.createElementNS(SVGNS, "svg");
			this.svg.setAttribute("xmlns", SVGNS);
			this.svg.setAttribute("width", this.originalSize.w);
			this.svg.setAttribute("height", this.originalSize.h);
			this.svg.setAttribute("viewBox", `0 0 ${this.originalSize.w} ${this.originalSize.h}`);
			this.container.appendChild(this.svg);

			const defs = document.createElementNS(SVGNS, "defs");
			this.svg.appendChild(defs);

			this.mask = document.createElementNS(SVGNS, "mask");
			this.mask.setAttribute("id", `mask-${this.key}-${this.index}`);
			this.mask.setAttribute("x", "0");
			this.mask.setAttribute("y", "0");
			this.mask.setAttribute("width", this.originalSize.w);
			this.mask.setAttribute("height", this.originalSize.h);
			this.mask.style.maskType = "alpha";
			defs.appendChild(this.mask);
			//*/


			// - Make a path
			this.path = document.createElementNS(SVGNS, "path");
			this.path.setAttribute("id", `path-${this.key}-${this.index}`);
			this.path.setAttribute("d", this.value.mask);

			//*
			this.text = document.createElementNS(SVGNS, "text");
			this.text.setAttribute("x", "2%");
			this.text.setAttribute("y", "76%");
			this.text.setAttribute("font-family", "FeelslikeEcommRegular");
			this.text.setAttribute("font-size", this.originalSize.h * 0.83);
			this.text.setAttribute("font-weight", "100");
			this.text.setAttribute("font-size-adjust", this.ratio);
			this.text.setAttribute("text-anchor", "start");
			this.text.textContent = this.key;


			// this.char.style.maskImage = `url(data:image/svg+xml,${this.svg.outerHTML})`;

			// - TEST
			if (TEST) {
				this.svg.appendChild(this.path);
				this.text.setAttribute("fill", 'magenta');

			} else {
				this.mask.appendChild(this.path);
				this.text.setAttribute("mask", `url(#mask-${this.key}-${this.index})`);
			}
			//*/
			this.svg.appendChild(this.text);

			gsap.set(this.path, {
				fill: 'none',
				stroke: '#000',
				strokeWidth: this.strokeWidth,
				strokeLinecap: 'round',
				strokeLinejoin: 'round'
			});

			this.speed *= 1 + (this.path.getTotalLength() * 0.001);

			gsap.from(this.path, {
				duration: this.speed,
				delay: this.delay,
				ease: this.ease,
				drawSVG: 0
			});

		}
	}


	function writeText(element, masks, elIndex, speed = 0.1, charDelay = 0.0, wordDelay = 0.0, ease = 'sine.in', delay = 1) {
		new SplitText(element, {
			type: "words,chars",
			mask: "chars",
			charsClass: "char",
			wordsClass: "word",
			smartWrap: true,
			autoSplit: true,
			onSplit(self) {
				let _delay = delay;
				let index = 0;
				for (const word of self.words) {
					for (const container of word.children) {
						const char = container.querySelector('.char');
						const key = char.textContent.toUpperCase();
						if (key) {
							const value = masks[key];
							if (value) {
								new WrittenChar(container, char, value, key, speed, _delay, `${elIndex}-${index}`, ease);
								index++;
								_delay += charDelay;
							}
						}
					}
					_delay += wordDelay;
				};
			}
		});
	}

	// - Init
	const writtenTexts = document.querySelectorAll('.written-text');
	let index = 0;
	for (const writtenText of writtenTexts) {
		const delay = Number(writtenText.getAttribute('written-delay')) || 1;
		writeText(writtenText, FeelsLikeEcomm_masks, index, .52, .15, .1, 'power4.out', delay);
		index++;
	}
});