declare global {
  namespace glue {
    interface ComponentDef {
        destroy: () => void;
    }
    abstract class Component implements ComponentDef {
        readonly root: HTMLElement;
        constructor(root: HTMLElement);
        destroy(): void;
        emit(evtType: string, evtData: unknown, shouldBubble?: boolean): void;
    }
    interface AmbientVideoDef {
        playVideo: () => void;
        pauseVideo: () => void;
    }
    class AmbientVideo extends Component implements AmbientVideoDef {
        constructor(root: HTMLElement);
        playVideo(): Promise<void>;
        pauseVideo(): void;
        destroy(): void;
    }
    interface BannerDef {
        close: () => void;
    }
    class Banner extends Component implements BannerDef {
        constructor(root: HTMLElement);
        close(): void;
        destroy(): void;
    }
    interface CarouselOptions {
        currentSlide: number;
        peekOut: boolean;
        navigation: boolean;
        animation: boolean;
        cyclical: boolean;
        cardsPerPage: number;
        dragging: boolean;
    }
    interface CarouselObserverData extends ObserverDataObj {
        currentSlide: number;
    }
    interface CarouselDef {
        reset: () => void;
        next: () => void;
        previous: () => void;
        setCurrentSlide: (current: number) => void;
        getCurrentSlide: () => number;
    }
    class Carousel extends Component implements CarouselDef {
        readonly options: CarouselOptions;
        readonly observer: Observer<CarouselObserverData>;
        constructor(root: HTMLElement, options?: Partial<CarouselOptions>);
        static get defaults(): CarouselOptions;
        destroy(): void;
        reset(): void;
        getCurrentSlide(): number;
        setCurrentSlide(slide: number): void;
        previous(): void;
        next(): void;
    }
    interface CopyDef {
        reset: () => void;
    }
    class Copy extends Component implements CopyDef {
        constructor(root: HTMLElement);
        destroy(): void;
        reset(): void;
    }
    interface DebounceDef {
        debounce: () => void;
        cancel: () => void;
    }
    class Debounce implements DebounceDef {
        constructor(fn: (...args: unknown[]) => void, delay: number);
        debounce(): void;
        cancel(): void;
    }
    type SimpleEasingFunction = (t: number) => number;
    type ComplexEasingFunction = (t: number, b: number, c: number, d: number, func: (p1: number) => number) => number;
    type EasingFunctionName = 'easeInSine' | 'easeOutSine' | 'easeInOutSine' | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad' | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic' | 'easeInQuart' | 'easeOutQuart' | 'easeInOutQuart' | 'easeInQuint' | 'easeOutQuint' | 'easeInOutQuint' | 'easeInExpo' | 'easeOutExpo' | 'easeInOutExpo' | 'easeInCirc' | 'easeOutCirc' | 'easeInOutCirc' | 'easeInBack' | 'easeOutBack' | 'easeInOutBack' | 'easeInElastic' | 'easeOutElastic' | 'easeInOutElastic' | 'easeInBounce' | 'easeOutBounce' | 'easeInOutBounce' | 'linear';
    type EventLike = string | Record<string, unknown>;
    type EventTargetHandler = (eventData?: EventLike) => void;
    class EventTarget {
        constructor();
        dispatchEvent(evtType: string, eventData?: EventLike): void;
        listen(evtType: string, handler: EventTargetHandler): void;
        unlisten(evtType: string, handler: EventTargetHandler): void;
        removeAllListeners(): void;
    }
    class ExpansionPanels extends Component {
        constructor(root: HTMLElement, options?: Partial<ExpansionPanelOptions>);
        destroy(): void;
    }
    interface ExpansionPanelOptions {
        isAnimated: boolean;
        panelsCount: number;
    }
    class ExpansionPanelsModel {
        isAnimated: boolean;
        panelsCount: number;
        panelsCollapsed: number;
        panelsStatus: string;
        constructor(options?: Partial<ExpansionPanelOptions>);
        static get defaults(): ExpansionPanelOptions;
        updatePanelsStatus(): void;
        listen(eventName: string, handler: EventTargetHandler): void;
        unlisten(eventName: string, handler: EventTargetHandler): void;
        dispatchEvent(eventName: string, eventData?: string): void;
    }
    interface FilterDef {
        reset: () => void;
        getFilteredItems: () => HTMLElement[] | undefined;
        getStateManager: () => FilterStateManager;
    }
    class Filter extends Component implements FilterDef {
        constructor(root: HTMLElement);
        destroy(): void;
        reset(category?: string): void;
        getFilteredItems(): HTMLElement[];
        getStateManager(): FilterStateManager;
    }
    interface FilterDataModel {
        [propName: string]: boolean;
    }
    type FilterStateManagerModels = Record<string, Observer<FilterDataModel>>;
    interface FilterStateManagerDef {
        getModel: (key: string) => Observer<FilterDataModel> | undefined;
        getModels: () => Record<string, Observer<FilterDataModel>>;
        setModel: (key: string, model: Observer<FilterDataModel>) => void;
    }
    class FilterStateManager implements FilterStateManagerDef {
        constructor();
        getModel(key: string): Observer<FilterDataModel> | undefined;
        getModels(): FilterStateManagerModels;
        setModel(key: string, model: Observer<FilterDataModel>): void;
        static reset(): void;
    }
    interface FilterData {
        strategy?: string;
        [propName: string]: FilterGroup | string | undefined;
    }
    type FilterGroup = Record<string, boolean>;
    type FilterTarget = Record<string, string[]>;
    type FilterMatchFunc = (filter: FilterData, key: string, value: string) => boolean;
    function filterlist(targetArr: FilterTarget[], filter: FilterData, matchFunc?: FilterMatchFunc): boolean[];
    interface FooterOptions {
        panelsBreakpoints: string[];
        isAnimated: boolean;
        columnCount: number;
    }
    interface FooterDef {
        configureExpansionPanels: (isPanels: boolean) => void;
    }
    class Footer extends Component implements FooterDef {
        options: FooterOptions;
        constructor(root: HTMLElement, options?: Partial<FooterOptions>);
        static get defaults(): FooterOptions;
        destroy(): void;
        configureExpansionPanels(isPanels: boolean): void;
    }
    type HeaderBreakpoints = 'md' | 'lg' | 'xl';
    interface HeaderOptions {
        breakpoint: HeaderBreakpoints;
        drawer: boolean;
        hideOnScroll: boolean;
        steppedNav: boolean;
    }
    interface HeaderDef {
        show: () => void;
        hide: () => void;
    }
    class Header extends Component implements HeaderDef {
        options: HeaderOptions;
        constructor(root: HTMLElement, headerOptions?: Partial<HeaderOptions>);
        static get defaultOptions(): HeaderOptions;
        destroy(): void;
        hide(): void;
        show(): void;
    }
    interface JumplinksOptions {
        offset: number;
        belowHeader: boolean;
    }
    interface JumplinksObserverData extends ObserverDataObj {
        activeLink: string;
    }
    interface JumplinksDef {
        reset: () => void;
        setActiveLink: (id: string) => void;
        getActiveLink: () => string;
        observer: Observer<JumplinksObserverData>;
    }
    class Jumplinks extends Component implements JumplinksDef {
        options: JumplinksOptions;
        observer: Observer<JumplinksObserverData>;
        constructor(root: HTMLElement, options?: Partial<JumplinksOptions>);
        destroy(): void;
        setActiveLink(id: string): void;
        getActiveLink(): string;
        reset(): void;
    }
    interface ModalDef {
        open: () => void;
        close: () => void;
        setFocusAfterClosed: (el: HTMLElement) => void;
    }
    class Modal extends Component implements ModalDef {
        constructor(el: HTMLElement, focusAfterClosed: HTMLElement, focusFirst?: HTMLElement | null);
        open(): void;
        close(): void;
        setFocusAfterClosed(el: HTMLElement): void;
        destroy(): void;
    }
    interface ObserverDataObj {
        [propName: string]: unknown;
    }
    type WatcherFunction = () => unknown;
    interface ObserverDef {
        data: ObserverDataObj;
        listen: (key: string | ObserverDataObj, callback: WatcherFunction) => void;
        unlisten: (key: string | ObserverDataObj, callback: () => unknown) => void;
        defineReactive: (obj: ObserverDataObj, key: string, val?: unknown) => void;
    }
    class Observer<T extends ObserverDataObj> implements ObserverDef {
        data: T;
        watchers: Map<string, WatcherFunction[]>;
        constructor(data: T);
        defineReactive(obj: ObserverDataObj, key: string, val?: unknown): void;
        listen(key: string | ObserverDataObj, callback: WatcherFunction): void;
        unlisten(key: string | ObserverDataObj, callback: () => unknown): void;
    }
    interface SmoothScrollDef {
        scrollToId: (id: string, elementConfig?: Partial<SmoothScrollOptions>) => void;
    }
    class SmoothScroll implements SmoothScrollDef {
        constructor(config?: Partial<SmoothScrollOptions>);
        scrollToId(id?: string, elementConfig?: Partial<SmoothScrollOptions>): void;
        destroy(): void;
    }
    interface SmoothScrollPosition {
        x: number;
        y: number;
    }
    interface SmoothScrollOptions {
        duration: number;
        offset: SmoothScrollPosition;
        easing: EasingFunctionName | SimpleEasingFunction;
        hash: boolean;
        direction: string;
        id?: string;
    }
    interface SocialDef {
        tooltipComponents: Tooltip[];
    }
    class Social extends Component implements SocialDef {
        tooltipComponents: Tooltip[];
        constructor(root: HTMLElement);
        destroy(): void;
    }
    interface TabPanelsOptions {
        panelsBreakpoints: string[];
        isPanelsAnimated: boolean;
        isResponsive: boolean;
        panelsCount: number;
    }
    interface TabPanelsDef {
        tabsComponent?: Tabs;
    }
    class TabPanels extends Component implements TabPanelsDef {
        tabsComponent?: Tabs;
        constructor(root: HTMLElement, options?: Partial<TabPanelsOptions>);
        static get defaults(): TabPanelsOptions;
        destroy(): void;
    }
    interface TabsOptions {
        currentTab: number;
    }
    interface TabsObserverData extends ObserverDataObj {
        currentTab: number;
    }
    interface TabsDef {
        setActiveTab: (idx: number) => void;
        getActiveTab: () => number;
        observer: Observer<TabsObserverData>;
    }
    class Tabs extends Component implements TabsDef {
        observer: Observer<TabsObserverData>;
        constructor(root: HTMLElement, options?: TabsOptions);
        setActiveTab(idx: number): void;
        getActiveTab(): number;
        destroy(): void;
    }
    interface TooltipOptions {
        placement?: 'top' | 'bottom' | 'left' | 'right';
        autoPosition?: boolean;
    }
    interface TooltipDef {
        open: () => void;
        close: () => void;
        destroy: () => void;
    }
    class Tooltip extends Component implements TooltipDef {
        readonly options: TooltipOptions;
        constructor(root: HTMLElement, options?: TooltipOptions);
        static get defaultOptions(): TooltipOptions;
        open(): void;
        close(): void;
        destroy(): void;
    }
    function initMultiTooltip(tooltipElems: NodeListOf<HTMLElement>): void;
    interface YtVideoOptions extends YT.PlayerOptions {
        playerId?: string;
        modalElement?: HTMLElement;
    }
    interface YoutubeVideoDef {
        refreshPlayerOptions: (options: YtVideoOptions) => void;
        getPlayer: () => YT.Player | undefined;
        getPlayerId: () => string;
        options: YtVideoOptions;
    }
    class YoutubeVideo extends Component implements YoutubeVideoDef {
        options: YtVideoOptions;
        constructor(root: HTMLElement, options?: YtVideoOptions);
        destroy(): void;
        static get defaultOptions(): YtVideoOptions;
        refreshPlayerOptions(passedOptions: YtVideoOptions): void;
        getPlayer(): YT.Player | undefined;
        getPlayerId(): string;
    }
  }
}
export {};
