import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  button: {
    width: 200,
    marginLeft: 15,
    marginTop: 30
  },
  form: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    padding: 20,
    marginBottom: 100
  },
  heading: {
    color: 'black',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginBottom: 50
  },
  label: {
    color: 'black'
  }
});
