import PubSub from 'pubsub-js';

export default class TimelineStore {

    constructor(fotos) {
        this.fotos = fotos;
    }

    subscribe(callback) {
        PubSub.subscribe('timeline', (topico, fotos) => {
            callback(fotos);
        });
    }

    lista(urlPerfil) {
        fetch(urlPerfil)
        .then(response => response.json())
        .then(fotos => {
            PubSub.publish("timeline", fotos);
            this.fotos = fotos;
        });
    }

    like(fotoId) {
        fetch(`http://localhost:8080/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, {method: 'POST'})
        .then(response => {
          if(response.ok) {
            return response.json();
          } else {
            throw new Error("Não foi possível realizar o like da foto");
          }
        })
        .then(liker => {
          const fotoEncontrada = this.fotos.find(foto => foto.id === fotoId);
          fotoEncontrada.likeada = !fotoEncontrada.likeada;
    
          const optionalLiker = fotoEncontrada.likers.find(likerAtual => likerAtual.login === liker.login);
          
          if(optionalLiker === undefined) {
            fotoEncontrada.likers.push(liker);
          } else {
            const novosLikers = fotoEncontrada.likers.filter(likerAtual => likerAtual.login !== liker.login);
            fotoEncontrada.likers = novosLikers;
          }
          PubSub.publish("timeline", this.fotos);
        });
    }

    comenta(fotoId, comentario) {
        const requestInfo = {
          method: 'POST',
          body: JSON.stringify({texto : comentario}),
          headers: new Headers({
            'Content-Type': 'application/json'
          })
        }
    
        fetch(`http://localhost:8080/api/fotos/${fotoId}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
        .then(response => {
            if(response.ok) {
                return response.json();
            } else {
                throw new Error("Não foi possível comentar na foto");
            }
        })
        .then(novoComentario => {
            const fotoEncontrada = this.fotos.find(foto => foto.id === fotoId);
            
            fotoEncontrada.comentarios.push(novoComentario);
            PubSub.publish("timeline", this.fotos);
        });
    }
}