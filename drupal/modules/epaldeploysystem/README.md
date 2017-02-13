osteam_initial_config_deploy . 

Use this to deploy INITIAL configuration entities/objects . 
Activate AFTER you actiate the other modules . 
NOTE! this doesn't work if there is already a configuration object of what you're trying to create. 
If you want to import an UPGRADED version of the configuration file, use the "d8_import_multiple_configfiles" module

THIS IS A TEMPLATE MODULE
you should

a) add the yml files in the folder config/install (this files should NOT contain the UUID line and I prospose that you create them by using drupal EXPORT feature) 
b) it is suggested to add as dependencies the required modules. So you need only to activate this module and all the other dependency modules are activated by drupal . THis supposed to make deployment easier


the skeleton is based on a sample EPAL project. Edit the files as required