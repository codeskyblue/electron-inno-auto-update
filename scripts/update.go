package main

import (
	"errors"
	"flag"
	"log"
	"os"
	"os/exec"
	"path/filepath"
)

var (
	ErrNoUpdateAvaliable = errors.New("No update avaliable")
	AppName              string
)

func init() {
	log.SetFlags(log.Lshortfile | log.LstdFlags)
	flag.StringVar(&AppName, "name", "", "App name")
	flag.Parse()
	if AppName == "" {
		appPath, _ := filepath.Abs(os.Args[0])
		AppName = filepath.Base(filepath.Dir(appPath))
		// log.Fatalf("run %s -h for more help", os.Args[0])
	}
}

func isExists(path string) bool {
	_, err := os.Stat(path)
	return err == nil
}

func runUpdate(name string) error {
	tmpDir := os.Getenv("TEMP")
	if tmpDir == "" {
		return errors.New("TEMP Dir is empty")
	}
	setupPath := filepath.Join(tmpDir, name+"-update.exe")
	if isExists(setupPath) {
		log.Println(setupPath)
		cmd := exec.Command("cmd", "/c", setupPath+" /SILENT")
		if err := cmd.Run(); err != nil {
			os.Rename(setupPath, setupPath+".bad-program")
			return err
		}
		log.Println("Finish run setup.exe")
		return os.Remove(setupPath)
	}
	return nil
}

func runApp(name string) error {
	// FIXME(ssx): need check sha
	if err := runUpdate(AppName); err != nil {
		return err
	}

	var cmd *exec.Cmd
	if flag.NArg() != 0 {
		cmd = exec.Command(flag.Arg(0), flag.Args()[1:]...)
	} else {
		appPath := filepath.Join(filepath.Dir(AppName), name)
		cmd = exec.Command(appPath)
	}
	log.Println("Run app:", cmd.Args)

	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	err := cmd.Run()
	if err != nil {
		// quit and install update
		if err.Error() == "exit status 7" {
			return runApp(name)
		}
		return err
	}
	return nil
}

func main() {
	err := runApp(AppName)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Program finished")
}
