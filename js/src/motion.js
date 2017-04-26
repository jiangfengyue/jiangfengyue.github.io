/* global NexT: true */

$(document).ready(function() {
    NexT.motion = {};

    function sidebarToggle(toggleId) {
        this.sidebarToggleLines = {
            lines: [],
            push: function(line) {
                this.lines.push(line);
            },
            init: function() {
                this.lines.forEach(function(line) {
                    line.init();
                });
            },
            arrow: function() {
                this.lines.forEach(function(line) {
                    line.arrow();
                });
            },
            arrow_right: function() {
                this.lines.forEach(function(line) {
                    line.arrow_right();
                });
            },
            close: function() {
                this.lines.forEach(function(line) {
                    line.close();
                });
            }
        };

        function SidebarToggleLine(settings) {
            this.el = $(settings.el);
            this.status = $.extend({}, {
                init: {
                    width: '100%',
                    opacity: 1,
                    left: 0,
                    rotateZ: 0,
                    top: 0
                }
            }, settings.status);
        }

        SidebarToggleLine.prototype.init = function() {
            this.transform('init');
        };
        SidebarToggleLine.prototype.arrow = function() {
            this.transform('arrow');
        };
        SidebarToggleLine.prototype.arrow_right = function() {
            this.transform('arrow_right');
        };
        SidebarToggleLine.prototype.close = function() {
            this.transform('close');
        };
        SidebarToggleLine.prototype.transform = function(status) {
            this.el.velocity('stop').velocity(this.status[status]);
        };

        this.sidebarToggleLine1st = new SidebarToggleLine({
            el: toggleId + ' .sidebar-toggle-line-first',
            status: {
                arrow: { width: '50%', rotateZ: '-45deg', top: '2px' },
                arrow_right: { width: '50%', rotateZ: '45deg', top: '2px', left: '40%' },
                close: { width: '100%', rotateZ: '-45deg', top: '5px' }
            }
        });
        this.sidebarToggleLine2nd = new SidebarToggleLine({
            el: toggleId + ' .sidebar-toggle-line-middle',
            status: {
                arrow: { width: '90%' },
                arrow_right: { width: '90%' },
                close: { opacity: 0 }
            }
        });
        this.sidebarToggleLine3rd = new SidebarToggleLine({
            el: toggleId + ' .sidebar-toggle-line-last',
            status: {
                arrow: { width: '50%', rotateZ: '45deg', top: '-2px' },
                arrow_right: { width: '50%', rotateZ: '-45deg', top: '-2px', left: '40%' },
                close: { width: '100%', rotateZ: '45deg', top: '-5px' }
            }
        });
    }

    var leftId = '#sidebar-toggle';
    var rightId = '#toggle-catalogue';
    var leftToggle = new sidebarToggle(leftId);
    var rightToggle = new sidebarToggle(rightId);

    leftToggle.sidebarToggleLines.push(leftToggle.sidebarToggleLine1st);
    leftToggle.sidebarToggleLines.push(leftToggle.sidebarToggleLine2nd);
    leftToggle.sidebarToggleLines.push(leftToggle.sidebarToggleLine3rd);
    rightToggle.sidebarToggleLines.push(rightToggle.sidebarToggleLine1st);
    rightToggle.sidebarToggleLines.push(rightToggle.sidebarToggleLine2nd);
    rightToggle.sidebarToggleLines.push(rightToggle.sidebarToggleLine3rd);

    var SIDEBAR_WIDTH = '320px';
    var SIDEBAR_DISPLAY_DURATION = 200;

    var sidebarToggleMotion = {
        toggleEl: $(leftId),
        sidebarEl: $('#sidebar'),
        toggleCatalogue: $(rightId),
        sidebarCatalogue: $('#sidebar-catalogue'),
        isleftSidebarVisible: false,
        isRightSidebarVisible: false,
        init: function() {
            this.toggleEl.on('click', this.clickHandler.bind(this));
            this.toggleEl.on('mouseenter', this.mouseEnterHandler.bind(this));
            this.toggleEl.on('mouseleave', this.mouseLeaveHandler.bind(this));
            this.toggleCatalogue.on('click', this.clickHandlerCatalogue.bind(this));
            this.toggleCatalogue.on('mouseenter', this.mouseEnterHandlerCatalogue.bind(this));
            this.toggleCatalogue.on('mouseleave', this.mouseLeaveHandlerCatalogue.bind(this));

            $(document)
                .on('sidebar.isShowing', function() {
                    NexT.utils.isDesktop() && $('body').velocity('stop').velocity({ paddingRight: SIDEBAR_WIDTH },
                        SIDEBAR_DISPLAY_DURATION
                    );
                })
                .on('sidebar.isHiding', function() {});
        },
        clickHandler: function() {
            this.isleftSidebarVisible ? this.hideSidebar(this.sidebarEl, leftToggle) : this.showSidebar(this.sidebarEl, leftToggle);
            this.isleftSidebarVisible = !this.isleftSidebarVisible;
        },
        mouseEnterHandler: function() {
            if (this.isleftSidebarVisible) {
                return;
            }
            leftToggle.sidebarToggleLines.arrow();
        },
        mouseLeaveHandler: function() {
            if (this.isleftSidebarVisible) {
                return;
            }
            leftToggle.sidebarToggleLines.init();
        },
        clickHandlerCatalogue: function() {
            this.isRightSidebarVisible ? this.hideSidebar(this.sidebarCatalogue, rightToggle) : this.showSidebar(this.sidebarCatalogue, rightToggle);
            this.isRightSidebarVisible = !this.isRightSidebarVisible;
        },
        mouseEnterHandlerCatalogue: function() {
            if (this.isRightSidebarVisible) {
                return;
            }
            rightToggle.sidebarToggleLines.arrow_right();
        },
        mouseLeaveHandlerCatalogue: function() {
            if (this.isRightSidebarVisible) {
                return;
            }
            rightToggle.sidebarToggleLines.init();
        },
        showSidebar: function(sideBar, toggle) {
            var self = this;

            toggle.sidebarToggleLines.close();

            sideBar.velocity('stop').velocity({
                width: SIDEBAR_WIDTH
            }, {
                display: 'block',
                duration: SIDEBAR_DISPLAY_DURATION,
                begin: function() {
                    $('.sidebar .motion-element').velocity(
                        'transition.slideRightIn', {
                            stagger: 50,
                            drag: true,
                            complete: function() {
                                sideBar.trigger('sidebar.motion.complete');
                            }
                        }
                    );
                },
                complete: function() {
                    sideBar.addClass('sidebar-active');
                    sideBar.trigger('sidebar.didShow');
                }
            });

            sideBar.trigger('sidebar.isShowing');
        },
        hideSidebar: function(sideBar, toggle) {
            NexT.utils.isDesktop() && $('body').velocity('stop').velocity({ paddingRight: 0 });
            sideBar.find('.motion-element').velocity('stop').css('display', 'none');
            sideBar.velocity('stop').velocity({ width: 0 }, { display: 'none' });

            toggle.sidebarToggleLines.init();

            sideBar.removeClass('sidebar-active');
            sideBar.trigger('sidebar.isHiding');

            //在 post 页面下按下隐藏 sidebar 时如果当前选中的是“站点概览”，将 toc 去除 motion 效果
            //防止再次打开时会出现在“站点概览”下的 bug
            if (!!$('.post-toc-wrap')) {
                if ($('.site-overview').css('display') === 'block') {
                    $('.post-toc-wrap').removeClass('motion-element');
                }
            }
        }
    };
    sidebarToggleMotion.init();

    NexT.motion.integrator = {
        queue: [],
        cursor: -1,
        add: function(fn) {
            this.queue.push(fn);
            return this;
        },
        next: function() {
            this.cursor++;
            var fn = this.queue[this.cursor];
            $.isFunction(fn) && fn(NexT.motion.integrator);
        },
        bootstrap: function() {
            this.next();
        }
    };

    NexT.motion.middleWares = {
        logo: function(integrator) {
            var sequence = [];
            var $brand = $('.brand');
            var $title = $('.site-title');
            var $subtitle = $('.site-subtitle');
            var $logoLineTop = $('.logo-line-before i');
            var $logoLineBottom = $('.logo-line-after i');

            $brand.size() > 0 && sequence.push({
                e: $brand,
                p: { opacity: 1 },
                o: { duration: 200 }
            });

            NexT.utils.isMist() && hasElement([$logoLineTop, $logoLineBottom]) &&
                sequence.push(
                    getMistLineSettings($logoLineTop, '100%'),
                    getMistLineSettings($logoLineBottom, '-100%')
                );

            hasElement($title) && sequence.push({
                e: $title,
                p: { opacity: 1, top: 0 },
                o: { duration: 200 }
            });

            hasElement($subtitle) && sequence.push({
                e: $subtitle,
                p: { opacity: 1, top: 0 },
                o: { duration: 200 }
            });

            if (sequence.length > 0) {
                sequence[sequence.length - 1].o.complete = function() {
                    integrator.next();
                };
                $.Velocity.RunSequence(sequence);
            } else {
                integrator.next();
            }


            function getMistLineSettings(element, translateX) {
                return {
                    e: $(element),
                    p: { translateX: translateX },
                    o: {
                        duration: 500,
                        sequenceQueue: false
                    }
                };
            }

            /**
             * Check if $elements exist.
             * @param {jQuery|Array} $elements
             * @returns {boolean}
             */
            function hasElement($elements) {
                $elements = Array.isArray($elements) ? $elements : [$elements];
                return $elements.every(function($element) {
                    return $.isFunction($element.size) && $element.size() > 0;
                });
            }
        },

        menu: function(integrator) {
            $('.menu-item').velocity('transition.slideDownIn', {
                display: null,
                duration: 200,
                complete: function() {
                    integrator.next();
                }
            });
        },

        postList: function(integrator) {
            var $post = $('.post');
            var hasPost = $post.size() > 0;

            hasPost ? postMotion() : integrator.next();

            function postMotion() {
                var postMotionOptions = window.postMotionOptions || {
                    stagger: 100,
                    drag: true
                };
                postMotionOptions.complete = function() {
                    integrator.next();
                };

                $post.velocity('transition.slideDownIn', postMotionOptions);
            }
        },

        sidebar: function(integrator) {
            if (CONFIG.sidebar.display === 'always') {
                NexT.utils.displaySidebar();
            }
            integrator.next();
        }
    };

});