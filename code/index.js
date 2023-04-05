/*
Аналог: https://pughtml.com/
        .one>div^a - видасть 
        <div class="one">
            <div></div>
        </div>
        <a href=""></a>

        . - класс
        # - id
        > 1й рівень вкладеності
        div - та інші назви тегів
        {} - текст
        на навій строці нові інструкуці 
        (Якщо в тексейрі перейшли на нову строку, 
        то видаємо як нову вкладеність)
    */

const BLOCK_ATTR = '.#';
const BLOCK_CONTENT = '{>\n';
let levelStack=-1;

window.addEventListener('DOMContentLoaded',() => 
    document.querySelector('#toCode-btn').addEventListener('click', () => {
        const userCode = document.querySelector('#user-code').value;
        document.querySelector('#result').innerText = '';
        try{
            parse(userCode.trim());
        } catch (e) {
            console.error(e);
            document.querySelector('#result').innerText = e;
        }
    })
)

const parse = (code, level = 0) => {
    if (code ==='') return 0; 

    let nextStop = findStopSymbol(code.substr(0,code.length));
    const tagName = isLetter(code[0]) ? code.substr(0,nextStop) : 'div';
    
    print('<' + tagName, level);

    if (tagName == 'a') print(' href=""');

    nextStop = fillAttr(nextStop, code);
    print('>');

    nextStop = fillContent(nextStop, code, level);
    print('</' + tagName + '>');

    if (code[nextStop] == '^') {
        if (levelStack<0){
            levelStack = level-1;
        } else if (levelStack == level){ 
            newLine();
            levelStack = -1;
            nextStop += parse(code.substr(nextStop+1), level)+1;
        }
    }

    return nextStop
}

const isLetter = (symbol) => {
    return symbol>='A' && symbol<='z';
}

const fillAttr = (stopIndex, code) => {
    if (BLOCK_ATTR.indexOf(code[stopIndex]) < 0) return stopIndex;
    
    const otherPart = code.substr(stopIndex + 1)
    const endAttr = findStopSymbol(otherPart);
    
    print(code[stopIndex] === '.' ? ' class' : ' id');
    print(' = "' + otherPart.substr(0, endAttr) + '"'); 

    return fillAttr (endAttr + stopIndex + 1, code)
}

const fillContent = (stopIndex, code, level = 0) => {
    if (BLOCK_CONTENT.indexOf(code[stopIndex]) < 0) return stopIndex;

    let otherPart = code.substr(stopIndex + 1)
    let endContent;
    
    newLine();

    if (code[stopIndex] == '{') {
        endContent = otherPart.indexOf('}');
        if(endContent<0) throw ('It is necessary }');
        print(otherPart.substr(0, endContent), level+1);
        stopIndex += endContent + 2;
    } else {
        stopIndex += parse(otherPart, level + 1)+1;
    }

    newLine(level);

    return stopIndex
}

const newLine = (level = 0) => {
    print('\n' + tab(level));
}

const tab = (level) => {
    let tabSeq = '';
    for (let i = 0; i < level; i++){
        tabSeq+='\t';
    }
    return tabSeq;
}

const print = (text,level = 0) => {
    document.querySelector('#result').innerText += tab(level) + text;
}

const findStopSymbol = (string) => {
    let index = string.length;
    const stopSymbol = BLOCK_ATTR + BLOCK_CONTENT + '^';
    for(let i=0; i<stopSymbol.length; i++){
        const newIndex = string.indexOf(stopSymbol[i]);
        if((newIndex > -1)&&(newIndex<index)){
                index = newIndex;
        }
    }
    return index;
}


