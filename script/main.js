function subject(){
    document.querySelector("#subject").innerHTML = `
    <header>
        <h1>WEB</h1>
        Hello!
    </header>
    `;
}
function toc(){
    const state = store.getState();
    let i = 0;
    let liTags = '';
    while(i<state.contents.length){
        liTags = liTags + `
        <li>
            <a onclick="
                event.preventDefault();
                let action = {type:'SELECT', id:${state.contents[i].id}}
                store.dispatch(action);
            " 
            href="${state.contents[i].id}">
            ${state.contents[i].title}</a>
        </li>
        `;
        i++;
    }
    document.querySelector("#toc").innerHTML = `
    <nav>
        <ol>${liTags}</ol>
    </nav>
    `;
}
function control(){
    document.querySelector("#control").innerHTML = `
    <ul>
        <li><a  onclick="
            event.preventDefault();
            store.dispatch({
                type:'CHANGE_MODE',
                mode:'create'
            })
            "
            href="/create">create</a></li>
        <li><input onclick="
                store.dispatch({
                    type:'DELETE'
                });
            " type="button" value="delete"></li>
    </ul>
    `;
}
function article(){
    const state = store.getState();
    if(state.mode === 'create'){
        document.querySelector("#article").innerHTML = `
        <article>
            <form onsubmit="
                event.preventDefault();
                let _title = this.title.value;
                let _desc = this.desc.value;
                store.dispatch({
                    type:'CREATE',
                    title:_title,
                    desc:_desc
                })
            ">
                <p>
                    <input type="text" name="title" placeholder="title">
                </p>
                <p>
                    <textarea name="desc" placeholder="description"></textarea>
                </p>    
                <p>
                    <input type="submit">
                </p>
            </form>
        </article>
        `
    } else if(state.mode === 'read'){
        let i = 0;
        let aTitle, aDesc;
        while(i < state.contents.length){
            if(state.contents[i].id === state.selected_id){
                aTitle = state.contents[i].title;
                aDesc = state.contents[i].desc;
                break;
            }
            i++;
        }
        document.querySelector("#article").innerHTML = `
        <article>
            <h2>${aTitle}</h2>
            ${aDesc}
        </article>
        `
    } else if(state.mode === 'welcome'){
        document.querySelector("#article").innerHTML = `
        <article>
            <h2>Welcome</h2>
            Hello, Redux!!
        </article>
        `
    }
}
function reducer(state, action){
    if(state === undefined){
        return{
            max_id: 2,
            mode: 'welcome',
            selected_id: 2,
            contents:[
                { id:1, title:'JavaScript',desc:'often abbreviated as JS, is a programming language that conforms to the ECMAScript specification.'},
                { id:2, title:'React',desc:'is a free and open-source front-end JavaScript library'},
            ]
        }
    }
let newState;
if(action.type === 'SELECT'){
    newState = Object.assign({}, state, {selected_id:action.id, mode:'read'});
} else if(action.type === 'CREATE'){
    let newMaxId = state.max_id + 1;
    let newContents = state.contents.concat();
    newContents.push({id:newMaxId, title:action.title, desc:action.desc});
    newState = Object.assign({}, state, {
        max_id:newMaxId,
        contents:newContents,
        mode:'read'
    })
} else if(action.type === 'DELETE'){
    let newContents = [];
    let i = 0;
    while(i < state.contents.length){
        if(state.selected_id !== state.contents[i].id){
            newContents.push(
                state.contents[i]
            );
        }
        i++;
    }
    newState = Object.assign({}, state, {
        contents:newContents,
        mode:'welcome'
    })
}else if(action.type === 'CHANGE_MODE'){
    newState = Object.assign({}, state, {
        mode:action.mode
    });
}
console.log(action, state, newState);
return newState;
}
const store = Redux.createStore(reducer);
store.subscribe(article);
store.subscribe(toc);
subject();
toc();
control();
article();