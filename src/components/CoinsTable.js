import axios from "axios";
import React, { useEffect, useState } from "react";
import { CoinList } from "../config/api";
import { CryptoState } from "../CryptoContext";
import {
  Container,
  ThemeProvider,
  Typography,
  createTheme,
  TextField,
  TableRow,
  TableHead,
  TableBody,
  Table,
  TableCell,
  TableContainer,
  LinearProgress,
  makeStyles,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";

const CoinsTable = () => {
  const { currency } = CryptoState();
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState();
  const [loading, setLoading] = useState(false);
  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));
    setCoins(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
  }, [currency]);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    console.log(search); // Add this line to print the value of search in the console
  };

  const handleSearch = () => {
    return coins.filter((coin) => {
      coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search);
    });
  };


  // const useStyles= makeStyles(()=>({}));
  // const classes= useStyles();
  const Navigate= useNavigate()

  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{ margin: 18, fontFamily: "montserrat" }}
        >
          Cryptocurrency by Market cap
        </Typography>
        <TextField
          label="Seacrh For a Crypto.."
          variant="outlined"
          style={{ marginBottom: 20, width: "100%" }}
          onChange={handleSearchChange}
        />
        <TableContainer>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "orange" }} />
          ) : (
            <Table>
              <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                <TableRow>
                  {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                    <TableCell
                      style={{
                        color: "black",
                        fontWeight: "700",
                        fontFamily: "Montserrat",
                      }}
                      key={head}
                      align={head === "Coin" ? "" : "right"}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {handleSearch().map((row) => {
                  const profit = row.price_change_percentage_24h > 0;
                  return (
                    <TableRow
                      onClick={() => Navigate(`/coins/${row.id}`)}
                      // className={classes.raw}
                      key={row.name}
                    >
                      <TableCell component="th" scope="row" styles={{
                        display:"flex",
                        gap:15
                      }}>
                        <img src={row?.image}
                        alt={row.name}
                        heigt="50"
                        style={{marginBottom:10}}
                        ></img>

                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Container>
    </ThemeProvider>
  );
};

export default CoinsTable;
