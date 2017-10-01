import React, {Component} from 'react';
import FotoItem from './FotoItem';
import PubSub from 'pubsub-js';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';


export default class Timeline extends Component {

  constructor(props) {
    super();
    this.state = {fotos: []};
    this.login = props.login;
  }

  componentWillMount() {
    PubSub.subscribe('timeline', (topico, fotos) => {
      this.setState({fotos});
    });

    PubSub.subscribe('atualiza-liker', (topico, infoLiker) => {
      const fotoEncontrada = this.state.fotos.find(foto => foto.id === infoLiker.fotoId);
      fotoEncontrada.likeada = !fotoEncontrada.likeada;

      const optionalLiker = fotoEncontrada.likers.find(liker => liker.login === infoLiker.liker.login);
      
      if(optionalLiker === undefined) {
        fotoEncontrada.likers.push(infoLiker.liker);
      } else {
        const novosLikers = fotoEncontrada.likers.filter(liker => liker.login !== infoLiker.liker.login);
        fotoEncontrada.likers = novosLikers;
      }
      this.setState({fotos: this.state.fotos});
    });

    PubSub.subscribe('novos-comentarios', (topico, infoComentario) => {
      const fotoEncontrada = this.state.fotos.find(foto => foto.id === infoComentario.fotoId);

      fotoEncontrada.comentarios.push(infoComentario.novoComentario);
      this.setState({fotos: this.state.fotos});
    });
  }

  carregaFotos() {
    let urlPerfil;
    if(this.login === undefined) {
      urlPerfil = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
    } else {
      urlPerfil = `http://localhost:8080/api/public/fotos/${this.login}`;
    }
    
    fetch(urlPerfil)
    .then(response => response.json())
    .then(fotos => {
      this.setState({fotos:fotos});
    });
  }

  componentDidMount() {
    this.carregaFotos();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.login !== undefined) {
      this.login = nextProps.login;
      this.carregaFotos();
    }
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
      PubSub.publish('atualiza-liker', {fotoId, liker});
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
      PubSub.publish('novos-comentarios', {fotoId, novoComentario});
    });
  }

  render() {
    return (
      <div className="fotos container">
        <ReactCSSTransitionGroup
          transitionName="timeline"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          {
            this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} like={this.like} comenta={this.comenta}/>)
          }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}