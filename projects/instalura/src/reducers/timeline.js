export function timeline(state=[], action) {
    if(action.type === 'LISTAGEM') {
        return action.fotos;
    }

    if(action.type === 'COMENTARIO') {
        const fotoEncontrada = state.find(foto => foto.id === action.fotoId);
        fotoEncontrada.comentarios.push(action.novoComentario);

        return state;
    }

    if(action.type === 'LIKE') {
        const fotoEncontrada = state.find(foto => foto.id === action.fotoId);
        fotoEncontrada.likeada = !fotoEncontrada.likeada;
    
        const liker = action.liker;
        const possivelLiker = fotoEncontrada.likers.find(likerAtual => likerAtual.login === liker.login);
        
        if(possivelLiker === undefined) {
            fotoEncontrada.likers.push(liker);
        } else {
            const novosLikers = fotoEncontrada.likers.filter(likerAtual => likerAtual.login !== liker.login);
            fotoEncontrada.likers = novosLikers;
        }

        return state;
    }

    return state;
}