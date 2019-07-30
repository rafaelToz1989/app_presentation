import React, { Component } from 'react';
import $ from 'jquery';
// import PlacesAutocomplete from 'react-places-autocomplete';
import SimpleForm from './components/SimpleForm';
// import ToggleForm from './components/ToggleForm';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import ToggleButtonGroup from 'react-bootstrap/lib/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/lib/ToggleButton';
import axios from 'axios';


class App extends Component {

  constructor() {
    super();
    this.state = {
      enderecos: [], logradouro: '', numero: '', complemento: '', semComplemento: false, index: 0, descricao: '',
      passo: "endereco", latitude: [], longitude: [], distancia: '', tempo: '', preco: '', opcaoRetirar: '',
      observacao: '', opcaoEntregar: ''
    };

    // Usando Arrow Functions, não precisa mais do .bind() aqui;

  }

  componentDidMount() {
    $(".exibe-tabela-preco").hide();
    $("#esconde-end-B").hide();
    $(".mensagem-validacao").hide();

  }


  createEndereco = (id, endereco, numero, complemento) => {
    return {
      id: id,
      endereco: endereco,
      numero: numero,
      complemento: complemento,
      descricao: ''
    }
  }


  setEndereco = (inputValue) => {
    $(".mensagem-validacao").hide();
    console.log(inputValue);
    var obj = JSON.parse(inputValue)
    this.setState({ logradouro: obj.address, numero: obj.number })
    this.setState({ inputValue: obj });

  }

  setSemComplemento = (evento) => {

    $(".mensagem-validacao").hide();

    this.setState({ complemento: '' });

    this.setState({ semComplemento: evento.target.semComplemento });
  }

  setComplemento = (evento) => {

    console.log(evento.target.value);

    console.log(this.state.complemento);

    $(".mensagem-validacao").hide();

    this.setState({ semComplemento: false });

    this.setState({ complemento: evento.target.value })

  }


  enviaFormA = (evento) => {

    evento.preventDefault();

    if (!this.state.numero === '' || !this.state.complemento && this.state.semComplemento === false) {
      $(".mensagem-validacao").show();

    } else {

      var endereco = this.createEndereco(this.state.index, this.state.logradouro, this.state.numero, this.state.complemento)
      console.log(endereco)
      var enderecos = this.state.enderecos
      enderecos.push(endereco)
      console.log(enderecos)
      this.setState({ enderecos: enderecos, passo: "descricao" })


      // this.setState({ endereco: this.state.endereco.concat(this.state.inputValue.address + ", " + this.state.inputValue.number), latitude: this.state.latitude.concat(this.state.inputValue.lat),
      //                 longitude: this.state.longitude.concat(this.state.inputValue.lng), numero: this.state.numero.concat(this.state.inputValue.number) });



    }
  }


  enviaFormB = (evento) => {

    evento.preventDefault();
    console.log(evento.target);

    if (this.state.descRemetente === '' && this.state.opcaoRetirar === '') {

      $(".mensagem-opcao-selecione").show();
      $(".mensagem-opcao-retirada").hide();
      $(".mensagem-opcao-outros").hide();

    } else if (this.state.descRemetente === '' && this.state.opcaoRetirar === 'option1') {

      $(".mensagem-opcao-selecione").hide();
      $(".mensagem-opcao-retirada").show();
      $(".mensagem-opcao-outros").hide();

    } else if (this.state.descRemetente === '' && this.state.opcaoRetirar === 'option2') {

      $(".mensagem-opcao-selecione").hide();
      $(".mensagem-opcao-retirada").show();
      $(".mensagem-opcao-outros").hide();

    } else if (this.state.descRemetente === '' && this.state.opcaoRetirar === 'option3') {

      $(".mensagem-opcao-selecione").hide();
      $(".mensagem-opcao-retirada").hide();
      $(".mensagem-opcao-outros").show();

    } else {

      if (this.state.enderecoDestino === '') {

        console.log(this.state);
        // this.setState({endereco:inputValue});
        // $("#esconde-end-salvo").hide();
        $("#esconde-falar-com").hide();
        $("#esconde-end-destino").show();
      } else {

        var enderecos = this.state.enderecos
        enderecos[this.state.index].descricao = this.state.descRemetente
        this.setState({ enderecos: enderecos, index: this.state.index + 1, passo: "endereco" })

        $("#esconde-end-salvo").hide();
        $("#esconde-falar-com").hide();
        $("#esconde-falar-com-destino").show();
      }
    }
  }



  setEnderecoDestino = (inputValue) => {
    $(".mensagem-validacao").hide();
    console.log(inputValue);
    var result = JSON.parse(inputValue);
    this.setState({ enderecoDestino: result.address + ", " + result.number, latitudeDestino: result.lat, longitudeDestino: result.lng, numeroDest: result.number });

    var request = {
      points: [
        { lat: this.state.latitudeOrigem, lng: this.state.longitudeOrigem },
        { lat: this.state.latitudeDestino, lng: this.state.longitudeDestino }
      ]
    }

    console.log(JSON.stringify(request));

    axios.post('https://api.loghero.com.br/v1/quotation', request)
      .then(resposta => {
        console.log(resposta);
        this.setState({ distancia: resposta.data.distance, tempo: resposta.data.timeFormatted, preco: resposta.data.priceFormatted });
        $(".exibe-tabela-preco").show("slow");
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
      })
  }

  setDescricao = (evento) => {

    this.setState({ descricao: evento.target.value });
  }


  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async selectText(component, start, end) {
    await this.sleep(100);

    component.focus()
    component.setSelectionRange(start, end);

  }

  setOpcao = (evento) => {

    console.log(evento.target);

    if (evento.target.value === "option1") {

      this.setState({ opcaoRetirar: evento.target.value });

      this.remetente.value = 'Retirar documento ou volume com NOME';

    } else if (evento.target.value === "option2") {

      this.setState({ opcaoRetirar: evento.target.value });

      this.remetente.value = 'Entregar documento ou volume para NOME';

    } else if (evento.target.value === "option3") {

      this.setState({ descricao: '', opcaoRetirar: evento.target.value });

      this.remetente.value = '';
    }

    const pos = this.remetente.value.indexOf('NOME');
    this.selectText(this.remetente, pos, pos + 4);
  }


  setEditEndRemetente = () => {

    if (this.state.enderecoDestino === '') {

      $("#esconde-end-destino").hide();
      $("#esconde-end-salvo").hide();
      $("#esconde-falar-com").hide();
      $("#esconde-falar-com-destino").hide();
      $("#esconde-calc-destino").hide();
      $(".exibe-tabela-preco").hide();
      $("#esconde-end-input").show();
    } else {
      $("#esconde-calc-destino").hide();
      $("#esconde-falar-com-destino").hide();
      $("#esconde-end-destino").hide();
      $("#esconde-end-salvo").hide();
      $("#esconde-falar-com").hide();
      $("#esconde-end-input").show();
      $("#esconde-end-B").show();
      $(".exibe-tabela-preco").show();

    }
  }

  setEditEndDestino = (evento) => {
    $("#esconde-calc-destino").hide();
    $("#esconde-end-salvo").hide();
    $("#esconde-falar-com-destino").hide();
    $("#esconde-end-input").hide();
    $("#esconde-end-salvo").show();
    $("#esconde-end-destino").show();

  }

  setAdicionaNovoPonto = () => {
    $("#esconde-novo-destino").hide();
    $("#esconde-novo-endereco").show();
    $(".exibe-tabela-preco").show();

  }

  render() {

    const divStyle1 = {
      color: 'red',
      fontWeight: 'bold',
      marginTop: '15px'

    };

    const divStyle2 = {
      color: 'red',
      fontWeight: 'bold',
      marginLeft: '100px'

    };



    const passoEndereco =
      <div id="esconde-end-input">
        <form onSubmit={this.enviaFormA} method="post">
          <div className="form-group row px-4 pt-4">
          </div>
          <div className="form-group px-4 col-md-12">
            <span className="badge badge-pill badge-secondary">A</span>
            <label htmlFor="formGroupExampleInput" className="form-group ml-2">Endereço</label>
            <SimpleForm type="text" className="form-control" value={this.state.logradouro}
              onChange={this.setEndereco}
              autocompleteContainer={".dropdown-googleapi"} id="inputEnderecoOrigem"
              placeholder="Digite o nome da rua ou cep" label="address" />
          </div>
          <div className="form-group row pl-5 pr-4">
            <div className="col custom-control custom-checkbox">
              <input type="checkbox" className="custom-control-input" checked={this.state.semComplemento} onChange={this.setSemComplemento} id="customCheck1" />
              <label className="custom-control-label" htmlFor="customCheck1">Sem complemento</label>
            </div>
            <div className="col">
              <input type="text" className="form-control" value={this.state.complemento} onChange={this.setComplemento} checked={this.state.semComplemento} placeholder="Complemento" />
              {/* onFocus={() => this.onSecondComplementoFocus()} */}
            </div>
            <div className="container">
              <div className="form-group px-4 mb-3">
                <div className="mensagem-validacao" style={divStyle1}><span>Insira o Endereço completo e Complemento</span></div>
              </div>
            </div>
          </div>

          <div className="form-group px-4 mb-3" id="esconde-end-B">
            <div className="card">
              <div className="card-header">
                <div className="row">
                  <div className="col-1">
                    <span className="badge badge-pill badge-secondary">B</span>
                  </div>
                  <div className="col">
                    <p><strong>{this.state.endereco}</strong></p>
                  </div>
                  <div className="col-md-auto">
                    <button type="button" className="btn btn-edit" onClick={this.setEditEnd} aria-label="Left Align">
                      <span className="oi oi-pencil" title="icon pencil" aria-hidden="true"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="exibe-tabela-preco">
            <ul className="list-group px-4 mb-3">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Tempo para entrega
      <span className="badge badge-secondary badge-pill">{this.state.tempo}</span>
              </li>
              <li className="list-group-item list-group-item-secondary d-flex justify-content-between align-items-center">
                Total a pagar
      <span className="badge badge-primary badge-pill">R$ {this.state.preco}</span>
              </li>
            </ul>
          </div>

          <div className="form-group row px-4">
            <input className="btn btn-primary btn-block" type="submit" data-toggle="button" aria-pressed="false" value="Próximo" />
            {/*<input className="btn btn-primary btn-block" type="submit" data-toggle="button" disabled={!this.state.enderecoOrigem} aria-pressed="false" value="Próximo" />*/}
          </div>

        </form>
      </div>

    const passoDescricao = 
    
    <div id="esconde-falar-com">

    <form className="px-4" onSubmit={this.enviaFormB} method="post">
    <p className="mb-2">O que o courier deve fazer?</p>
    <ButtonToolbar>
    <ToggleButtonGroup className="btn-group btn-group-toggle mb-3" type="radio" name="options" >
    <ToggleButton id="option1" className="btn btn-secondary btn-sm"  onChange={this.setOpcao} value="option1" >Retirada</ToggleButton>
    <ToggleButton id="option2" className="btn btn-secondary btn-sm"  onChange={this.setOpcao} value="option2" >Entrega</ToggleButton>
    <ToggleButton id="option3" className="btn btn-secondary btn-sm"  onChange={this.setOpcao} value="option3" >Outros serviços</ToggleButton>
    </ToggleButtonGroup>
    </ButtonToolbar>
    <input type="text" className="form-control mb-4" onChange={this.setDescricao} label="remetente" ref= {(x) => {this.remetente = x;}} />
    <div className="form-group row px-4">
    <div className="container">
      <div className="form-group row pl-5">
      <div className="mensagem-opcao-selecione" style={divStyle2}><span>Escolha uma opção</span></div>
      <div className="mensagem-opcao-retirada" style={divStyle2}><span>Preencha com o nome</span></div>
      <div className="mensagem-opcao-outros" style={divStyle2}><span>Descreva o serviço</span></div>
      </div>
    </div>
    </div>
    <div className="form-group row">
    <input className="btn btn-primary btn-block" type="submit" data-toggle="button" aria-pressed="false" value="Próximo" />
    </div>
    </form>
    
    </div>



    var content = ''

      if(this.state.passo === 'endereco')
        content = passoEndereco
      else if(this.state.passo === 'descricao')
        content = passoDescricao
      

    return (
      <div className="bg-pakman">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-dark bg-pakman justify-content-between">
            <a className="navbar-brand">
              <img src="./assets/brand/logo-pakman-h-branco.png" width="170" height="45" alt="Pakman Logo" />
            </a>
            <ul className="navbar-nav justify-content-end">
              <li className="nav-item">
                <a className="nav-link" href="">Ajuda</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="">Entrar</a>
              </li>
            </ul>
          </nav>
        </div>
        <main role="main" className="container mt-5">
          <div className="row">
            <div className="col-sm bg-light mb-5">
              {content}
            </div>
            <div className="col-sm px-5 mb-5 font-light">
              <h2>Com Pakman você faz seu pedido super rápido e com segurança.</h2>
              <p>Acompanhe o motoboy em tempo real e saiba exatamente quem está fazendo a sua entrega. ;)</p>
              <img src="./assets/img/pakman-symbol.png" className="rounded mx-auto d-block mt-5" alt="Símbolo Pakman" />
            </div>
            </div>
        </main>

    </div>

    )
  }
}

export default App;