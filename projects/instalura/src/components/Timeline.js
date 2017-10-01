import React, {Component} from 'react';
import FotoItem from './FotoItem';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

export default class Timeline extends Component {

  constructor(props) {
    super();
    this.state = {fotos: []};
    this.login = props.login;
  }

  componentWillMount() {
    this.props.timelineStore.subscribe(fotos => {
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

    this.props.timelineStore.lista(urlPerfil);
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
    this.props.timelineStore.like(fotoId);
  }

  comenta(fotoId, comentario) {
    this.props.timelineStore.comenta(fotoId, comentario);
  }

  render() {
    return (
      <div className="fotos container">
        <ReactCSSTransitionGroup
          transitionName="timeline"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          {
            this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} like={this.like.bind(this)} comenta={this.comenta.bind(this)}/>)
          }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}