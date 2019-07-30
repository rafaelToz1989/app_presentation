import React from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng, geocodeByPlaceId } from 'react-places-autocomplete'

export default class SimpleForm extends React.Component {

  constructor(props) {

    super(props)
    this.id = props.id
    this.type = props.type
    this.state = { address: '', loading: false }
    this.focusTextInput = this.focusTextInput.bind(this);
    this.selectNumber = this.selectNumber.bind(this);
    this.sleep = this.sleep.bind(this);

    // this.onChange;
    this.onChange = (input) => {
      this.setState({ address: input })
    }
  }

  focusTextInput(response) {
    if(response.number === 0){
      var address = response.address
      var pos = address.length
      // var endereco = address.substr(0, pos)
      address += ", numero"
      this.setState({address:address})
      this.autocomplete.props.inputProps.value = address
      this.selectNumber(this, pos)
    } else {

    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async selectNumber(component, pos) {
    await this.sleep(100);

    component.input.focus()
    component.input.setSelectionRange(pos+2, pos+8);
    component.forceUpdate()
  }


  render() {
    // var input = this
    const inputProps = {
      id: this.id,
      value: this.state.address,
      onChange: this.onChange,
      onFocus: this.props.onFocus,
      ref: (input) => { this.input = input }



    }

    // function sleep(ms) {
    //   return new Promise(resolve => setTimeout(resolve, ms));
    // }

    // async function demo() {
    //   console.log('Taking a break...');
    //   await sleep(2000);
    //   input.props.onFocus(input)
    //   console.log('Two second later');
    // }


    // const options = {
    //   // location: new google.maps.LatLng(-23.549885, -46.634031),
    //   radius: 50000,
    //   types: ['address']
    // }

    const handleSelect = (address, placeId) => {
      const response = {
        formattedAddress: address,
        address: "",
        number: 0,
        lat: 0.0,
        lng: 0.0
      }

      //PLACE
      geocodeByPlaceId(placeId)
        .then(results => {
          results.forEach(function(item){
            console.log(item)
            for (var i = 0; i < item.address_components.length; i++) {
              for (var j = 0; j < item.address_components[i].types.length; j++) {
                if (item.address_components[i].types[j] === "street_number") {
                  response.number = item.address_components[i].long_name
                } else if (item.address_components[i].types[j] === "route") {
                  response.address = item.address_components[i].short_name
                  console.log(item.address_components[i])
                }
              }
            }
          })

          this.props.onChange(JSON.stringify(response))
          this.focusTextInput(response)

        })
        .catch(error => console.error(error))

      //GEOCODE
      geocodeByAddress(response.formattedAddress)
        .then(results => getLatLng(results[0]))
        .then(latLng => {
          response.lat = latLng.lat
          response.lng = latLng.lng
          this.props.onChange(JSON.stringify(response))
        })
        .catch(error => console.error('Error', error))

           this.setState({
              address,
              loading: false
            })
              //after you receive the response, you set it back to false

            this.props.onChange(JSON.stringify(response))

    }

    const myStyles = {
      input: { width: '100%', border: '1px solid #ef3f40' },
      autocompleteContainer: { backgroundColor: 'red', border: '1px solid #ef3f40', position:'relative' }
    }

    return (

       <PlacesAutocomplete
       inputProps ={inputProps}
       debounce={600}
       ref={(input) => { this.autocomplete = input; }}
       styles={myStyles}
       onSelect={handleSelect}
       onEnterKeyDown={handleSelect}
       />
    )
  }
}
