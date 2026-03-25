import { getServiceInfo } from './processCheck';
import { readConfigFile } from './index';

export interface StatusLineInput {
    model?: string;
    provider?: string;
}

export async function parseStatusLineData(input: StatusLineInput, presetName?: string): Promise<string> {
    try {
        const config = await readConfigFile();

        // Try to determine current model
        let model = input.model;
        let provider = input.provider;

        // If not provided in input, try to get from config
        if (!model && config.Router?.default) {
            const defaultRoute = config.Router.default;
            const parts = defaultRoute.split(',');
            if (parts.length === 2) {
                provider = parts[0];
                model = parts[1];
            }
        }

        if (!model) {
            return "Claude";
        }

        // Format the status line
        const displayModel = model.split('/')[0]; // Remove any prefix
        return `${provider || 'claude'}:${displayModel}`;
    } catch (error) {
        return "Claude";
    }
}

export async function showStatus() {
    const info = await getServiceInfo();
    
    console.log('\n📊 Claude Code Router Status');
    console.log('═'.repeat(40));
    
    if (info.running) {
        console.log('✅ Status: Running');
        console.log(`🆔 Process ID: ${info.pid}`);
        console.log(`🌐 Port: ${info.port}`);
        console.log(`📡 API Endpoint: ${info.endpoint}`);
        console.log(`📄 PID File: ${info.pidFile}`);
        console.log('');
        console.log('🚀 Ready to use! Run the following commands:');
        console.log('   ccr code    # Start coding with Claude');
        console.log('   ccr stop   # Stop the service');
    } else {
        console.log('❌ Status: Not Running');
        console.log('');
        console.log('💡 To start the service:');
        console.log('   ccr start');
    }
    
    console.log('');
}
