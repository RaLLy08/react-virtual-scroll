class ScrollHanlder {
    containerHeight = null;
    itemHeight = null;
    itemsOnScreen = null;
    itemsLength = null;

    fromIndex = 0;
    toIndex = 0;

    fromIndexWithMargin = 0;
    toIndexWithMargin = 0;

    marginFromIndex = 0;
    marginToIndex = 0;

    scrollTop = null;
    topPlaceholderHeight = null;
    bottomPlaceholderHeight = null;
    marginElementsLimit = 10;


    constructor(containerHeight, itemHeight, itemsLength) {
        this.containerHeight = containerHeight;
        this.itemHeight = itemHeight;
        this.itemsLength = itemsLength;

        this.#setItemsOnScreen();
        this.#setIndexBoundaries();
        this.#setPlaceholdersHeights();
    }

    #setItemsOnScreen = () => {
        this.itemsOnScreen = Math.ceil(this.containerHeight / this.itemHeight);
    }

    #setIndexBoundaries = () => {
        this.fromIndex = Math.floor((this.scrollTop) / this.itemHeight);
        this.toIndex = this.fromIndex + this.itemsOnScreen;
    }
    
    #setIndexBoundariesWithMargin = () => {
        this.fromIndexWithMargin = this.fromIndex - this.marginFromIndex ;
        this.toIndexWithMargin = this.toIndex + this.marginToIndex;
    }

    #setIndexMargins = () => {
        const margin = this.marginElementsLimit;

        this.marginFromIndex = Math.min(this.fromIndex, margin);
        this.marginToIndex = Math.min(this.itemsLength - this.toIndex, margin);
    }

    #setPlaceholdersHeights = () => {
        this.topPlaceholderHeight = (this.fromIndexWithMargin) * this.itemHeight;
        this.bottomPlaceholderHeight = (this.itemsLength - this.toIndexWithMargin) * this.itemHeight;
    }

    getPlaceholdersHeight = () => {
        return [this.topPlaceholderHeight, this.bottomPlaceholderHeight];
    }

    getElementsSliceOnScreen = (elements) => {

        return elements.slice(
            this.fromIndexWithMargin,
            this.toIndexWithMargin
        );
    }

    onScroll = (scrollTop) => {

        this.scrollTop = scrollTop;

        this.#setIndexBoundaries();
        this.#setIndexMargins()
        this.#setIndexBoundariesWithMargin();

        this.#setPlaceholdersHeights();
    }
}
    

function List() {
    const containerHeight = 300;
    const itemHeight = 15;

    const els = React.useMemo(() => Array.from({ length: 10000 }, (_, i) => 
        i
    ), [])
    const [scrollTop, setScrollTop] = React.useState(0);

    const scrollHandler = React.useMemo(() => {
        return new ScrollHanlder(containerHeight, itemHeight, els.length);
    }, [containerHeight, itemHeight, els.length]);


    const handleScroll = (e) => {
        const { scrollTop } = e.target;
        setScrollTop(scrollTop);
    }

    scrollHandler.onScroll(scrollTop);

    const elementsOnScreen = scrollHandler.getElementsSliceOnScreen(els);

    const [topPlaceholderHeight, bottomPlaceholderHeight] = scrollHandler.getPlaceholdersHeight();

    
    return <div 
        style={{
            height: `${containerHeight}px`, 
            overflow: "auto",
            margin: 'auto',
            width: '500px',
        }}
        onScroll={handleScroll}
    >   
        <div style={{height: `${topPlaceholderHeight}px`}}></div>
        {elementsOnScreen.map((el) => {
            return <div
                style={{height: `${itemHeight}px`}}
                key={el}
            >
                Hello {el}
            </div>;
        })}
        <div style={{height: `${bottomPlaceholderHeight}px`}}></div>
    </div>
}

function MyApp() {
    return <List/>
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);


root.render(<MyApp />);