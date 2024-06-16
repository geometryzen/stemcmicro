{
    "$schema": "./node_modules/nx/schemas/nx-schema.json",
    "targetDefaults": {
        "build": {
            "cache": true,
            "dependsOn": ["^build"]
        },
        "test": {
            "dependsOn": ["build"],
            "cache": true,
            "options": {
                "passWithNoTests": true
            }
        }
    },
    "plugins": [
        {
            "plugin": "@nx/jest/plugin",
            "options": {
                "targetName": "test"
            }
        }
    ]
}
