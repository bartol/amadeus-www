package core

import (
	"errors"
	"io"
	"io/ioutil"
	"os"

	"github.com/jmoiron/sqlx"
	"github.com/pelletier/go-toml"
	"github.com/sirupsen/logrus"

	// postgresql driver
	_ "github.com/lib/pq"
)

// Global contains global variables like database connection etc
var Global = struct {
	DB     *sqlx.DB
	Log    *logrus.Logger
	Device string
	PDV    int
}{}

// Config contains configuration file options
type Config struct {
	DatabaseURL string
	LogPath     string
	Device      string
	PDV         int
}

// Setup is function that configures Global var
func Setup(configPath string) error {
	// read config in var
	configData, err := ioutil.ReadFile(configPath)
	if err != nil {
		return err
	}

	// bind config to its struct
	config := Config{}
	err = toml.Unmarshal(configData, &config)
	if err != nil {
		return err
	}

	// check if all required values are present and valid
	if config.DatabaseURL == "" {
		return errors.New("database connection url missing from config")
	}
	if config.Device == "" {
		return errors.New("device name missing from config")
	}
	if config.PDV == 0 {
		return errors.New("pdv missing from config")
	}
	if config.PDV < 0 || config.PDV > 100 {
		return errors.New("pdv must be between 0 and 100")
	}

	// connect to db if not already connected
	if Global.DB == nil {
		dbconn, err := sqlx.Connect("postgres", config.DatabaseURL)
		if err != nil {
			return err
		}
		Global.DB = dbconn
	}

	// configure logger
	if Global.Log == nil {
		// open (and create) log file
		logfile, err := os.OpenFile(config.LogPath, os.O_APPEND|os.O_WRONLY|os.O_CREATE, 0755)
		if err != nil {
			return err
		}

		Global.Log = logrus.New()
		Global.Log.SetOutput(io.MultiWriter(os.Stdout, logfile))
		// show file, line and function name in logs
		Global.Log.SetReportCaller(true)
	}

	// set values from config to global
	if Global.Device == "" {
		Global.Device = config.Device
	}
	if Global.PDV == 0 {
		Global.PDV = config.PDV
	}

	return nil
}
