import React, {Component} from 'react';
import FotoItem from './FotoItem';
import PubSub from 'pubsub-js';

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

  render() {
    return (
      <div className="fotos container">
        {
          this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto}/>)
        }
      </div>
    );
  }
}